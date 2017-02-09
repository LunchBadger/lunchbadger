'use strict';

const config = require('../../common/lib/config');
const cors = require('cors');

process.env.WORKSPACE_DIR = config.workspaceDir;
const workspace = require('loopback-workspace');

workspace.middleware('initial', cors({
  origin: true,
  credentials: true,
  maxAge: 86400,
  exposedHeaders: ['ETag']
}));

module.exports = function(app, cb) {
  app.workspace = workspace;
  const {DataSourceDefinition, PackageDefinition} = workspace.models;

  workspace.listen(app.get('workspacePort'), app.get('host'), () => {
    console.log(`Workspace listening at http://${app.get('host')}:${app.get('workspacePort')}`);
  });

  DataSourceDefinition.observe('before save', function(ctx, next) {
    const connector = `loopback-connector-${ctx.instance.connector}`;

    PackageDefinition.findById('workspace-dev')
      .then(packageDef => {
        // Return to the client right away, install dependencies in the
        // background.
        next();

        if (!packageDef.dependencies[connector]) {
          app.models.WorkspaceStatus.proc.addDep(connector);
        }
      });
  });

  DataSourceDefinition.observe('before delete', function(ctx, next) {
    DataSourceDefinition.find()
      .then(allDs => {
        let deps = {};
        let connector;

        for (const ds of allDs) {
          if (ds.id === ctx.where.id) {
            connector = ds.connector;
          } else {
            deps[ds.connector] = (deps[ds.connector] || 0) + 1;
          }
        }

        // Return to the client right away, uninstall dependencies in the
        // background
        next();

        if (!deps[connector]) {
          const connectorModule = `loopback-connector-${connector}`;
          app.models.WorkspaceStatus.proc.removeDep(connectorModule);
        }
      });
  });

  cb();
};

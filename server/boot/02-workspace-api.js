const cors = require('cors');
const config = require('../../common/lib/config');

process.env.WORKSPACE_DIR = config.workspaceDir;
const workspace = require('loopback-workspace');

workspace.middleware('initial', cors({
  origin: true,
  credentials: true,
  maxAge: 86400,
  exposedHeaders: ['ETag']
}));

module.exports = function (app, cb) {
  app.workspace = workspace;
  const {DataSourceDefinition, PackageDefinition} = workspace.models;
  workspace.listen(app.get('workspacePort'), app.get('host'), () => {
    // eslint-disable-next-line no-console
    console.log(`Workspace listening at http://${app.get('host')}:${app.get('workspacePort')}`);
  });

  DataSourceDefinition.observe('before save', (ctx, next) => {
    if (ctx.instance.connector === 'memory') {
      // memory connector is built in
      return next();
    }

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

  DataSourceDefinition.observe('before delete', (ctx, next) => {
    DataSourceDefinition.find()
      .then(allDs => {
        let deps = new Map();
        // Count up all the connectors we depend on
        for (const ds of allDs) {
          if (ds.connector === 'memory') {
            // memory connector is built in
            continue;
          } else if (ds.id === ctx.where.id ||
                     Object.keys(ctx.where).length === 0) {
            deps.set(ds.connector, deps.get(ds.connector) || 0);
          } else {
            deps.set(ds.connector, (deps.get(ds.connector) || 0) + 1);
          }
        }

        const modulesToRemove = [];
        for (const [connector, numDeps] of deps.entries()) {
          if (numDeps === 0) {
            modulesToRemove.push(`loopback-connector-${connector}`);
          }
        }

        // Return to the client right away, uninstall dependencies in the
        // background
        next();

        if (modulesToRemove.length > 0) {
          app.models.WorkspaceStatus.proc.removeDep(...modulesToRemove);
        }
      });
  });

  cb();
};

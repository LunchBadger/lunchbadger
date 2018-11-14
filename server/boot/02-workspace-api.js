const cors = require('cors');
const config = require('../../common/lib/config');
const {saveToGit} = require('../../common/lib/util');
const debug = require('debug')('lunchbadger-workspace:save');
process.env.WORKSPACE_DIR = config.workspaceDir;
const username = process.env.LB_PRODUCER;
const workspace = require('@lunchbadger/loopback-workspace');

workspace.middleware('initial', cors({
  origin: true,
  credentials: true,
  maxAge: 86400,
  exposedHeaders: ['ETag']
}));

module.exports = function (app, cb) {
  app.workspace = workspace;
  const {DataSourceDefinition, PackageDefinition, ModelDefinition, ModelProperty, ModelConfig, ModelRelation} = workspace.models;
  workspace.listen(app.get('workspacePort'), app.get('host'), () => {
    // eslint-disable-next-line no-console
    console.log(`Workspace listening at http://${app.get('host')}:${app.get('workspacePort')}`);
  });

  [DataSourceDefinition, PackageDefinition, ModelDefinition, ModelProperty, ModelConfig, ModelRelation].forEach(m => {
    m.observe('after save', (ctx, next) => {
      try {
        saveToGit(`LunchBadger: Changes in ${m.modelName}`, next);
      } catch (err) {
        debug(err);
        next(new Error(`Error saving ${m.modelName}`));
      }
    });
    m.observe('after delete', (ctx, next) => {
      try {
        saveToGit(`LunchBadger: ${m.modelName} removed`, next);
      } catch (err) {
        debug(err);
        next(new Error(`Error deleting ${m.modelName}`));
      }
    });
  });

  DataSourceDefinition.observe('before save', (ctx, next) => {
    if (ctx.instance.connector === 'memory') {
      // memory connector is built in
      return next();
    }

    const connector = `loopback-connector-${ctx.instance.connector}`;

    PackageDefinition.findById(`${username}-dev`)
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

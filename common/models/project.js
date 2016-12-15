const async = require('async');
const debug = require('debug')('lunchbadger-workspace:project');
const promisify = require('es6-promisify');
const exec = promisify(require('child_process').exec);

module.exports = function(Project) {

  Project.prototype.clearProject = function(cb) {
    let wsModels = Project.app.workspace.models;

    async.series([
      callback => {
        this._deleteAllModels(callback);
      },
      callback => {
        debug(`deleting all data sources`);
        wsModels.DataSourceDefinition.destroyAll(callback);
      },
      callback => {
        debug(`deleting all model configs`);
        wsModels.ModelConfig.destroyAll(callback);
      }
    ], (err, res) => {
      if (err) {
        cb(err);
        return;
      }

      this.privateEndpoints = [];
      this.publicEndpoints = [];
      this.apis = [];
      this.portals = [];
      this.gateways = [];
      this.connections = [];
      this.states = [];

      this.save(cb);
    });
  };

  Project.remoteMethod('clearProject', {
    description: 'Clear all data from the project, including the workspace',
    isStatic: false,
    http: { path: '/clear', verb: 'post' }
  });

  Project.prototype._deleteAllModels = function(cb) {
    let wsModels = Project.app.workspace.models;

    async.waterfall([
      callback => {
        wsModels.ModelDefinition.find(callback);
      },
      (modelDefs, callback) => {
        let tasks = modelDefs
          .filter(model => model.facetName === 'server')
          .map(model => modelDelCb => {
            debug(`deleting model definition for ${model.id}`);
            model.delete(modelDelCb);
          });
        async.series(tasks, callback);
      }
    ], cb);
  };

  Project.observe('after save', function(ctx, next) {
    exec('git status', {cwd: process.env.WORKSPACE_DIR})
      .then((stdout) => {
        if (!stdout.includes('nothing to commit')) {
          debug('changes detected, committing');
          return commit();
        } else {
          debug('nothing to commit');
        }
      }).then(() => {
        next(null);
      }).catch(err => {
        console.log(err.stack);
        next(new Error('Error saving project'));
      });
  });
};

function commit() {
  return exec('git add -A', {cwd: process.env.WORKSPACE_DIR})
    .then(() => {
      return exec('git commit -m "Changes via LunchBadger"',
                  {cwd: process.env.WORKSPACE_DIR});
    })
    .then(() => {
      return exec('git push', {cwd: process.env.WORKSPACE_DIR})
        .catch((err) => {
        });
    })
}

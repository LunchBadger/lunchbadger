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
    execWs('git status')

      // Commit, if necessary
      .then((stdout) => {
        if (!stdout.includes('nothing to commit')) {
          debug('changes detected, committing');
          return commit();
        } else {
          debug('nothing to commit');
        }
      })

      // Push to Git
      .then(() => {
        return push();
      })

      // Return result
      .then(success => {
        if (!success) {
          err = new Error('Conflict in Git repository');
          err.status = 409;
          next(err);
        } else {
          next(null);
        }
      })
      .catch(err => {
        console.log(err);
        next(new Error('Error saving project'));
      });
  });
};

function execWs(cmd) {
  return exec(cmd, {cwd: process.env.WORKSPACE_DIR});
}

function commit() {
  return execWs('git add -A')
    .then(() => {
      return execWs('git commit -m "Changes via LunchBadger"');
    });
}

function push() {
  return execWs('git push')
    .then(() => true)
    .catch((err) => {
      if (err.message.includes('[rejected]')) {
        return reset().then(() => false);
      } else {
        throw err;
      }
    });
}

function reset() {
  return execWs('git reset --hard origin/master')
    .then(() => {
      return execWs('git pull');
    });
}

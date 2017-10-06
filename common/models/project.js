const async = require('async');
const debug = require('debug')('lunchbadger-workspace:project');
const {execWs, commit, push} = require('../lib/util');
const config = require('../lib/config');

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

      this.functions = [];
      this.serviceEndpoints = [];
      this.apiEndpoints = [];
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

      // Remember the new revision
      .then(rev => {
        if (rev) {
          Project.workspaceStatus.revision = rev;
          return Project.workspaceStatus.save();
        }
      })

      // Push to Git
      .then(() => {
        debug('pushing');
        return push(config.branch);
      })

      // Return result
      .then(success => {
        if (!success) {
          debug('conflict detected');
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

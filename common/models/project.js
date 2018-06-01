const async = require('async');
const debug = require('debug')('lunchbadger-workspace:project');
const {execWs, commit, push} = require('../lib/util');
const config = require('../lib/config');

module.exports = function (Project) {
  Project.prototype.clearProject = function (cb) {
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
      this.microServices = [];
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

  Project.prototype._deleteAllModels = function (cb) {
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

  Project.observe('after save', function (ctx, next) {
    try {
      let rev, success;
      let stdout = execWs('git status');
      // Commit, if necessary
      if (!stdout.includes('nothing to commit')) {
        debug('changes detected, committing');
        rev = commit();
      } else {
        debug('nothing to commit');
      }

      // Remember the new revision
      if (rev) {
        Project.workspaceStatus.revision = rev;
        Project.workspaceStatus.save();
      }

      // Push to Git
      debug('pushing');
      success = push(config.branch);

      // Return result
      if (!success) {
        debug('conflict detected');
        let err = new Error('Conflict in Git repository');
        err.status = 409;
        next(err);
      } else {
        next(null);
      }
    } catch (err) {
      debug(err);
      next(new Error('Error saving project'));
    }
  });
};

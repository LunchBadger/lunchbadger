const async = require('async');

module.exports = function(Project) {

  Project.prototype.clearProject = function(cb) {
    let wsModels = Project.app.workspace.models;

    async.series([
      callback => {
        this._deleteAllModels(callback);
      },
      callback => {
        wsModels.DataSourceDefinition.destroyAll(callback);
      },
      callback => {
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

  Project.prototype._deleteAllModels = function(cb) {
    let wsModels = Project.app.workspace.models;

    async.waterfall([
      callback => {
        wsModels.ModelDefinition.find(callback);
      },
      (modelDefs, callback) => {
        let tasks = modelDefs.map(model => modelDelCb => {
          model.delete(modelDelCb);
        })
        async.series(tasks, callback);
      }
    ], cb);
  }

  Project.remoteMethod('clearProject', {
    description: 'Clear all data from the project, including the workspace',
    isStatic: false,
    http: { path: '/clear', verb: 'post' }
  })
};

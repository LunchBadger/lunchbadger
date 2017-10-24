'use strict';
const config = require('../../common/lib/config');
const {reset} = require('../../common/lib/util');
const debug = require('debug')('lunchbadger-workspace:workspace');
module.exports = function (WorkspaceStatus) {
  WorkspaceStatus.ping = function (cb) {
    cb();
  };

  WorkspaceStatus.remoteMethod('ping', {
    description: 'For checking whether the server is up. Responds with 204.',
    http: {verb: 'get', path: '/ping'}
  });

  WorkspaceStatus.restart = function (cb) {
    WorkspaceStatus.proc.restart();
    cb();
  };
  WorkspaceStatus.hardReset = function (cb) {
    reset(config.branch).then((hrRes) => {
      debug('hard reset', hrRes);
      WorkspaceStatus.proc.restart();

      cb();
    });
  };

  WorkspaceStatus.remoteMethod('restart', {
    description: 'Restart the workspace process',
    http: { verb: 'post', path: '/restart' }
  });

  WorkspaceStatus.remoteMethod('hardReset', {
    description: 'Git hard reset and Restart the workspace process',
    http: {verb: 'post', path: '/hard-reset'}
  });

  WorkspaceStatus.reinstallDeps = function (cb) {
    WorkspaceStatus.proc.reinstallDeps();
    cb();
  };

  WorkspaceStatus.remoteMethod('reinstallDeps', {
    description: 'Reinstall the project\'s dependencies',
    http: { verb: 'post', path: '/reinstall' }
  });

  // When starting a change stream, send the current view of each of the models
  // down the pipe first thing after connection.
  WorkspaceStatus.createChangeStream = function (options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }

    const PersistedModel = WorkspaceStatus.app.loopback.PersistedModel;
    PersistedModel.createChangeStream.call(this, options, (err, changes) => {
      if (err) {
        return cb(err);
      }

      WorkspaceStatus.find((err, models) => {
        if (err) {
          return cb(err);
        }
        models.forEach(model => {
          changes.write({
            target: model.id,
            data: model.toJSON(),
            type: 'update'
          });
        });
      });

      cb(null, changes);
    });
  };
};

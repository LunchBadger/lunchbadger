'use strict';

module.exports = function(WorkspaceStatus) {
  WorkspaceStatus.ping = function(cb) {
    cb();
  }

  WorkspaceStatus.remoteMethod('ping', {
    description: "For checking whether the server is up. Responds with 204.",
    http: { verb: 'get', path: '/ping' }
  });
};

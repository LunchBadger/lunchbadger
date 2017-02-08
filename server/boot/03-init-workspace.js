'use strict';

const uuidv1 = require('uuid').v1;
const {ensureWorkspace} = require('../../common/lib/wsinit');

module.exports = function(app, cb) {
  ensureWorkspace(app)
    .then(rev => {
      return app.models.WorkspaceStatus.create({
        running: false,
        output: '',
        instance: uuidv1(),
        revision: rev
      });
    })
    .then(status => {
      app.models.Project.workspaceStatus = status;
      cb();
    })
    .catch(err => {
      cb(err);
    });
};


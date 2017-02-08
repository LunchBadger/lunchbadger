'use strict';

const config = require('../../common/lib/config');
const cors = require('cors');

process.env.WORKSPACE_DIR = config.workspaceDir;
const workspace = require('loopback-workspace');

workspace.middleware('initial', cors({
  origin: true,
  credentials: true,
  maxAge: 86400,
  exposedHeaders: ['ETag']
}));

module.exports = function(app, cb) {
  app.workspace = workspace;

  workspace.listen(app.get('workspacePort'), app.get('host'), () => {
    console.log(`Workspace listening at http://${app.get('host')}:${app.get('workspacePort')}`);
  });

  cb();
};

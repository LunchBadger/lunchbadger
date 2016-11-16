'use strict';

const path = require('path');
const cors = require('cors');

process.env.WORKSPACE_DIR = path.normalize(path.join(__dirname, '../../workspace'));
const workspace = require('loopback-workspace');

workspace.middleware('initial', cors({
  origin: true,
  credentials: true,
  maxAge: 86400,
  exposedHeaders: ["ETag"]
}));

module.exports = function(app) {
  app.workspace = workspace;
  workspace.listen(app.get('workspacePort'), app.get('host'), function() {
    console.log(`Managing workspace in ${process.env.WORKSPACE_DIR}`);
    console.log(`Workspace listening at http://${app.get('host')}:${app.get('workspacePort')}`);
  });
};

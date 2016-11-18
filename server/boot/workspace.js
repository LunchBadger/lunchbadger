'use strict';

const fs = require('fs');
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

module.exports = function(app, cb) {
  app.workspace = workspace;
  workspace.listen(app.get('workspacePort'), app.get('host'), function() {
    console.log(`Workspace listening at http://${app.get('host')}:${app.get('workspacePort')}`);
  });

  ensureWorkspace(workspace, cb);
};

function ensureWorkspace(workspaceApp, cb) {
  let Workspace = workspaceApp.models.Workspace;

  let userName = process.env.LB_USER || 'workspace';
  let userEnv = process.env.LB_ENV || 'dev';
  let wsName = `${userName}-${userEnv}`;

  let pkgFile = path.join(process.env.WORKSPACE_DIR, 'package.json');
  if (!fs.existsSync(pkgFile)) {
    console.log(`Creating workspace in ${process.env.WORKSPACE_DIR}`);
    Workspace.createFromTemplate('empty-server', wsName, cb);
  } else {
    console.log(`Managing workspace in ${process.env.WORKSPACE_DIR}`);
    cb();
  }
}

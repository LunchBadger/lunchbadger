'use strict';

const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemon = require('nodemon');
const debug = require('debug')('lunchbadger-workspace:workspace');

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

  app.models.WorkspaceStatus.create({
    running: false,
    output: ''
  }).then(status => {
    ensureWorkspace(workspace, cb);
    runWorkspace(status);
  });
};

function ensureWorkspace(workspaceApp, cb) {
  let {Workspace, FacetSetting} = workspaceApp.models;

  let userName = process.env.LB_USER || 'workspace';
  let userEnv = process.env.LB_ENV || 'dev';
  let wsName = `${userName}-${userEnv}`;

  let pkgFile = path.join(process.env.WORKSPACE_DIR, 'package.json');
  if (!fs.existsSync(pkgFile)) {
    console.log(`Creating workspace in ${process.env.WORKSPACE_DIR}`);
    Workspace.createFromTemplate('empty-server', wsName, () => {
      FacetSetting.upsert({
        "id": "server.port",
        "facetName": "server",
        "name": "port",
        "value": 5000
      }, cb);
    });
  } else {
    console.log(`Managing workspace in ${process.env.WORKSPACE_DIR}`);
    cb();
  }
}

function runWorkspace(status) {
  let proc = nodemon({
    cwd: process.env.WORKSPACE_DIR,
    script: 'server/server.js',
    delay: 750,
    stdout: false
  });

  let output = '';
  let debounce = null;

  proc.on('stderr', buf => {
    output += buf.toString('utf-8');
  });

  proc.on('stdout', buf => {
    output += buf.toString('utf-8');
  });

  function changeStatus(running, output) {
    if (debounce) {
      clearTimeout(debounce);
    }

    debounce = setTimeout(() => {
      status.running = running;
      status.output = output;
      status.save();
    }, 1500);
  }

  proc.on('start', () => {
    debug('workspace started');
    changeStatus(true, '');
  });

  proc.on('crash', () => {
    debug('workspace crashed! output follows');
    debug(output);
    changeStatus(false, output);
    output = '';
  });

  proc.on('exit', () => {
    debug('workspace exited');
    changeStatus(false, output);
    output = '';
  });
}

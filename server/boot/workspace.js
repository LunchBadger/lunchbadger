'use strict';

const promisify = require('es6-promisify');
const exec = promisify(require('child_process').exec);
const fs = require('fs');
const ncp = promisify(require('ncp'));
const path = require('path');
const cors = require('cors');
const nodemon = require('nodemon');
const debug = require('debug')('lunchbadger-workspace:workspace');

process.env.WORKSPACE_DIR = path.normalize(path.join(__dirname, '../../workspace'));
const workspace = require('loopback-workspace');

const PROJECT_TEMPLATE = path.normalize(path.join(__dirname, '../blank-project.json'));

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
  let gitUrl = process.env.GIT_URL || 'http://localhost:3002/git/demo.git';
  let wsName = `${userName}-${userEnv}`;

  let pkgFile = path.join(process.env.WORKSPACE_DIR, 'package.json');
  let projectFile = path.join(process.env.WORKSPACE_DIR, 'lunchbadger.json');

  let promise = Promise.resolve(null);
  if (!fs.existsSync(process.env.WORKSPACE_DIR)) {
    console.log(`Cloning workspace repo to ${process.env.WORKSPACE_DIR}`);

    promise = promise
      .then(() => {
        return exec(`git clone ${gitUrl} ${process.env.WORKSPACE_DIR}`);
      })
  }

  if (!fs.existsSync(pkgFile)) {
    console.log(`Creating new LoopBack project`);

    promise = promise
      .then(() => {
        const createFromTemplate = promisify(
          Workspace.createFromTemplate.bind(Workspace));

        return createFromTemplate('empty-server', wsName)
          .then(() => {
            return promisify(FacetSetting.upsert.bind(FacetSetting))({
              "id": "server.port",
              "facetName": "server",
              "name": "port",
              "value": 5000
            });
          }).then(() => {
            return exec('git add -A', {cwd: process.env.WORKSPACE_DIR});
          }).then(() => {
            return exec('git commit -m "New LoopBack project"',
                        {cwd: process.env.WORKSPACE_DIR});
          });
      });
  }

  if (!fs.existsSync(projectFile)) {
    promise = promise.then(() => {
      return ncp(PROJECT_TEMPLATE, projectFile);
    });
  }

  promise.then(() => {
    console.log(`Managing workspace in ${process.env.WORKSPACE_DIR}`);
    cb();
  }).catch(err => {
    cb(err);
  });
}

function runWorkspace(status) {
  let proc = nodemon({
    cwd: process.env.WORKSPACE_DIR,
    script: 'server/server.js',
    delay: 750,
    stdout: false,
    env: {
      LOOPBACK_URL_PREFIX: process.env.WORKSPACE_URL_PREFIX
    }
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

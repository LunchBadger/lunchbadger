'use strict';

const promisify = require('es6-promisify');
const EventSource = require('eventsource');
const exec = promisify(require('child_process').exec);
const {execWs, reset} = require('../../common/lib/util');
const config = require('../../common/lib/config');
const fs = require('fs');
const ncp = promisify(require('ncp'));
const path = require('path');
const cors = require('cors');
const nodemon = require('nodemon');
const uuidv1 = require('uuid').v1;
const debug = require('debug')('lunchbadger-workspace:workspace');

process.env.WORKSPACE_DIR = config.workspaceDir;
const workspace = require('loopback-workspace');

const PROJECT_TEMPLATE = path.normalize(path.join(__dirname, '../blank-project.json'));

workspace.middleware('initial', cors({
  origin: true,
  credentials: true,
  maxAge: 86400,
  exposedHeaders: ["ETag"]
}));

module.exports = function(app, cb) {
  let wsName = `${config.userName}-${config.userEnv}`;

  app.workspace = workspace;
  workspace.listen(app.get('workspacePort'), app.get('host'), function() {
    console.log(`Workspace listening at http://${app.get('host')}:${app.get('workspacePort')}`);
  });

  ensureWorkspace(workspace, wsName, config.branch, config.gitUrl)
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

      runWorkspace(status);
      watchConfigStore(status, config.branch);
    })
    .then(() => {
      cb();
    })
    .catch(err => {
      cb(err);
    });
};

function ensureWorkspace(workspaceApp, wsName, branch, gitUrl) {
  let {Workspace, FacetSetting} = workspaceApp.models;

  let pkgFile = path.join(config.workspaceDir, 'package.json');
  let projectFile = path.join(config.workspaceDir, 'lunchbadger.json');

  let needsCommit = false;

  let promise = Promise.resolve(null);
  if (!fs.existsSync(config.workspaceDir)) {
    console.log(`Cloning workspace repo to ${config.workspaceDir}`);

    promise = promise
      .then(() => {
        return exec(`git clone ${gitUrl} ${config.workspaceDir}`);
      })

      // Make sure we have the correct branch
      .then(() => {
        return execWs(`git checkout ${branch}`).catch(err => {
          if (err.message.includes('did not match any file(s)')) {
            return execWs('git checkout master')
                   // Ignore errors from this as there may not be a master
                   // branch
                   .catch(() => true)
                   .then(() => {
                      return execWs(`git checkout -b ${branch}`);
                   });
          } else {
            throw err;
          }
        });
      });
  }

  promise = promise.then(() => {
    if (!fs.existsSync(pkgFile)) {
      console.log(`Creating new LoopBack project`);

      const createFromTemplate = promisify(
        Workspace.createFromTemplate.bind(Workspace));

      return createFromTemplate('empty-server', wsName)
        .then(() => {
          needsCommit = true;
          return promisify(FacetSetting.upsert.bind(FacetSetting))({
            "id": "server.port",
            "facetName": "server",
            "name": "port",
            "value": 5000
          });
        });
    }
  });

  promise = promise.then(() => {
    if (!fs.existsSync(projectFile)) {
      needsCommit = true;
      return ncp(PROJECT_TEMPLATE, projectFile);
    }
  });

  promise = promise.then(() => {
    if (needsCommit) {
      return execWs('git add -A')
        .then(() => {
          return execWs('git commit -m "New LunchBadger project"');
        });
    }
  })

  promise = promise.then(() => {
    console.log(`Managing workspace in ${config.workspaceDir}`);
    return execWs('git show --format="format:%H" -s');
  }).then((rev) => {
    return rev.trim();
  })

  return promise;
}

function runWorkspace(status) {
  let options = {
    cwd: config.workspaceDir,
    script: 'server/server.js',
    delay: 750,
    stdout: false
  }
  if (process.env.WORKSPACE_URL_PREFIX) {
    options.env = {
      LOOPBACK_URL_PREFIX: process.env.WORKSPACE_URL_PREFIX
    };
  }

  let proc = nodemon(options);

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

function watchConfigStore(status, branch) {
  const watchUrl = (process.env.WATCH_URL ||
    `http://localhost:3002/api/producers/demo/change-stream`);
  let connected = false;
  let es = new EventSource(watchUrl);
  es.addEventListener('data', function(message) {
    let statusUpdate = JSON.parse(message.data);

    if (statusUpdate.type !== 'push') {
      return;
    }

    let doReset = false;
    for (const change of statusUpdate.changes) {
      if (change.type === 'head' && change.ref === branch) {
        if (change.after !== status.revision) {
          doReset = true;
        }
        break;
      }
    }

    if (doReset) {
      debug('git push detected, resetting workspace');
      status.instance = uuidv1();
      status.save()
        .then(() => {
          return reset(branch);
        })
        .catch(err => {
          console.error(err);
        });
    }
  });

  es.addEventListener('open', () => {
    if (!connected) {
      console.log('connected to configstore');
      connected = true;
    }
  });

  es.addEventListener('error', (err) => {
    if (connected !== false) {
      console.log('disconnected from configstore');
      connected = false;
    }
  });
}

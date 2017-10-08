'use strict';

const promisify = require('es6-promisify');
const config = require('./config');
const exec = promisify(require('child_process').exec);
const {execWs} = require('./util');
const fs = require('fs');
const ncp = promisify(require('ncp'));
const path = require('path');
const debug = require('debug')('lunchbadger-workspace:workspace');

const PROJECT_TEMPLATE = path.normalize(
  path.join(__dirname, '../../server/blank-project.json'));

function ensureWorkspace(app) {
  const wsName = `${config.userName}-${config.userEnv}`;
  const {branch, gitUrl} = config;

  let Workspace = app.workspace.models.Workspace;

  let pkgFile = path.join(config.workspaceDir, 'package.json');

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
      console.log('Creating new LoopBack project');

      const createFromTemplate = promisify(
        Workspace.createFromTemplate.bind(Workspace));

      needsCommit = true;
      return createFromTemplate('empty-server', wsName).then(() => {
        const oldPackage = JSON.parse(fs.readFileSync(pkgFile).toString());

        const newPackageJSON = Object.assign({}, oldPackage);
        newPackageJSON.dependencies['loopback-component-explorer'] = 'LunchBadger/loopback-component-explorer#user-profile';
        newPackageJSON.scripts.postinstall = 'npm uninstall loopback-component-explorer && npm install LunchBadger/loopback-component-explorer#user-profile';

        fs.writeFileSync(pkgFile, JSON.stringify(newPackageJSON, null, 2));
      });
    }
  });

  promise = promise.then(() => {
    return ensureProjectFileExists().then((createdProject) => {
      needsCommit = needsCommit || createdProject;
    });
  });

  promise = promise.then(() => {
    if (needsCommit) {
      return execWs('git add -A')
        .then(() => {
          return execWs('git commit -m "New LunchBadger project"');
        });
    }
  });

  promise = promise.then(() => {
    // Make sure we reload project data, since it may have changed
    const connector = app.dataSources.db.connector;
    return promisify(connector.loadFromFile.bind(connector))();
  }).then(() => {
    console.log(`Managing workspace in ${config.workspaceDir}`);
    return execWs('git show --format="format:%H" -s');
  }).then((rev) => {
    return rev.trim();
  });

  return promise;
};

function ensureProjectFileExists() {
  let projectFile = path.join(config.workspaceDir, 'lunchbadger.json');

  if (!fs.existsSync(projectFile)) {
    debug(`creating a new project file (${projectFile})`);
    return ncp(PROJECT_TEMPLATE, projectFile).then(() => true);
  }

  return Promise.resolve(false);
}

module.exports = {
  ensureWorkspace,
  ensureProjectFileExists
};

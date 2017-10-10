'use strict';
const fs = require('fs');
const path = require('path');
const util = require('util');

require('util.promisify/shim')();

const _ = require('lodash');
const debug = require('debug')('lunchbadger-workspace:workspace');
const promisify = require('es6-promisify');
const exec = promisify(require('child_process').exec);
const ncp = promisify(require('ncp'));

const {execWs} = require('./util');
const config = require('./config');

const readFile = util.promisify(fs.readFile);

const PROJECT_TEMPLATE = path.normalize(
  path.join(__dirname, '../../server/blank-project.json'));

function ensureWorkspace(app) {
  const wsName = `${config.userName}-${config.userEnv}`;
  const {branch, gitUrl} = config;

  let Workspace = app.workspace.models.Workspace;
  let TEMPLATE_DIR = path.join(__dirname, '..', '..', 'templates', 'projects');

  // HACK to provide custom template folder
  Workspace._loadProjectTemplate = function(templateName) {
    let template;
    try {
      template = require(
        '../../templates/projects/' + templateName + '/data');
    } catch (e) {
      console.error('Cannot load project template %j: %s',
                    templateName, e.stack);
      return null;
    }
    // TODO(bajtos) build a full list of files here, so that
    // when two templates provide a different version of the same file,
    // we resolve the conflict here, before any files are copied
    template.files = [path.join(TEMPLATE_DIR, templateName, 'files')];

    let sources = [template];
    /* eslint-disable one-var */
    if (template.inherits) for (let ix in template.inherits) {
      let t = template.inherits[ix];
      let data = this._loadProjectTemplate(t);
      if (!data) return null; // the error was already reported
      delete data.supportedLBVersions;
      sources.unshift(data);
    }
    /* eslint-enable one-var */

    // TODO(bajtos) use topological sort to resolve duplicated dependencies
    // e.g. A inherits B,C; B inherits D; C inherits D too

    // merge into a new object to preserve the originals
    sources.unshift({});

    // when merging arrays, concatenate them (lodash replaces by default)
    sources.push((a, b) => {
      if (_.isArray(a)) {
        return a.concat(b);
      }
    });

    return _.mergeWith.apply(_, sources);
  }.bind(Workspace);

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
      return createFromTemplate('lb-server', wsName);
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

function ensureFunctionModelSynchronization(app) {
  return new Promise(resolve => {
    const ModelDefinition = app.workspace.models.ModelDefinition;
    ModelDefinition.find((err, definitions) => {

      const functionModelDefs = definitions.filter(def => {
        return def.kind === 'function';
      });

      functionModelDefs.forEach(def => {
        let funcFile = def.configFile
          .replace(/^server\/internal/, 'server/functions')
          .replace(/\.json$/, '.js');

        funcFile = path.join(config.workspaceDir, funcFile);
        
        return readFile(funcFile, { encoding: 'utf8' })
          .then(data => {
            def.code = data;
            ModelDefinition.update(def);
            resolve();
          });
      });
    });
  });
};

module.exports = {
  ensureWorkspace,
  ensureProjectFileExists,
  ensureFunctionModelSynchronization
};

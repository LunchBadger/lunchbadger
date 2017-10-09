'use strict';

const fs = require('fs');
const path = require('path');
const cors = require('cors');
const assert = require('assert');
const handlebars = require('handlebars');
const mkdirp = require('mkdirp');
const config = require('../../common/lib/config');

const TEMPLATES_PATH = path.join(__dirname, '..', '..', 'templates');
const FUNCTION_MODEL_TEMPLATE = path.join(TEMPLATES_PATH, 'fnmodel.js.tmpl');
const FUNCTION_TEMPLATE = path.join(TEMPLATES_PATH, 'fn.js.tmpl');

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
  const {DataSourceDefinition, ModelConfig, ModelDefinition, PackageDefinition, ConfigFile} = workspace.models;

  workspace.listen(app.get('workspacePort'), app.get('host'), () => {
    console.log(`Workspace listening at http://${app.get('host')}:${app.get('workspacePort')}`);
  });

  // This will provide additional file lookup pattern
  ModelDefinition.settings.configFiles.push('internal/*json');

  // Hack to overrride hardcoded "models" folder filtering
  ConfigFile.getModelDefFiles = function(configFiles, facetName) {
    assert(Array.isArray(configFiles));
    let configFile;
    let results = [];
    for (let i = 0; i < configFiles.length; i++) {
      configFile = configFiles[i];
      // TODO(ritch) support other directories
      if (configFile && configFile.getFacetName() === facetName &&
         (configFile.getDirName() === 'models' || configFile.getDirName() === 'internal')) {
        results.push(configFile);
      }
    }
    return results;
  };

  // HACK to override location of where model is saved
  ModelDefinition.getPath = function(facetName, obj) {
    if (obj.configFile) return obj.configFile;

    if (obj.kind === 'function') {
      // TODO set internal as  ModelDefinition.settings.internalDir
      return path.join(facetName, 'internal',
        ModelDefinition.toFilename(obj.name) + '.json');
    }
    // TODO(ritch) the path should be customizable
    return path.join(facetName, ModelDefinition.settings.defaultDir,
      ModelDefinition.toFilename(obj.name) + '.json');
  };

  ModelDefinition.observe('before save', (ctx, next) => {
    if (ctx.instance.kind !== 'function') {
      next();
      return;
    }

    ctx.instance.public = true;
    ctx.instance.base = 'Model';
    ctx.instance.http.path = ctx.instance.name;

    ModelConfig.create({
      public: true,
      dataSource: null,
      facetName: 'server',
      name: ctx.instance.name
    }, next);
  });

  ModelDefinition.observe('after save', (ctx, next) => {
    if (ctx.instance.kind !== 'function') {
      next();
      return;
    }

    let filename = ModelDefinition.toFilename(ctx.instance.name) + '.js';
    const modelPath = path.join(config.workspaceDir, 'server', 'internal', filename);

    if (!ctx.isNewInstance) {
      next();
      return;
    }

    mkdirp(path.join(config.workspaceDir, 'server', 'functions'), err => {
      if (err) {
        throw err;
      }

      fs.readFile(FUNCTION_TEMPLATE, {encoding: 'utf8'}, (err, data) => {
        if (err) {
          throw err;
        }

        const template = handlebars.compile(data);
        const output = template({
          functionName: ctx.instance.name
        });

        const fnPath = path.join(config.workspaceDir, 'server', 'functions', filename);
        fs.writeFile(fnPath, output, err => {
          if (err) {
            throw err;
          }

          fs.readFile(FUNCTION_MODEL_TEMPLATE, {encoding: 'utf8'}, (err, data) => {
            if (err) {
              throw err;
            }

            const template = handlebars.compile(data);
            const output = template({
              modelClassName: ctx.instance.name,
              functionName: ctx.instance.name,
              filename: filename,
              path: ctx.instance.http.path
            });

            fs.writeFile(modelPath, output, err => {
              if (err) {
                throw err;
              }

              next();
            });
          });
        });
      });
    });
  });

  DataSourceDefinition.observe('before save', (ctx, next) => {
    if (ctx.instance.connector === 'memory') {
      // memory connector is built in
      return next();
    }

    const connector = `loopback-connector-${ctx.instance.connector}`;

    PackageDefinition.findById('workspace-dev')
      .then(packageDef => {
        // Return to the client right away, install dependencies in the
        // background.
        next();

        if (!packageDef.dependencies[connector]) {
          app.models.WorkspaceStatus.proc.addDep(connector);
        }
      });
  });

  DataSourceDefinition.observe('before delete', (ctx, next) => {
    DataSourceDefinition.find()
      .then(allDs => {
        let deps = new Map();
        // Count up all the connectors we depend on
        for (const ds of allDs) {
          if (ds.connector === 'memory') {
            // memory connector is built in
            continue;
          } else if (ds.id === ctx.where.id ||
                     Object.keys(ctx.where).length === 0) {
            deps.set(ds.connector, deps.get(ds.connector) || 0);
          } else {
            deps.set(ds.connector, (deps.get(ds.connector) || 0) + 1);
          }
        }

        const modulesToRemove = [];
        for (const [connector, numDeps] of deps.entries()) {
          if (numDeps === 0) {
            modulesToRemove.push(`loopback-connector-${connector}`);
          }
        }

        // Return to the client right away, uninstall dependencies in the
        // background
        next();

        if (modulesToRemove.length > 0) {
          app.models.WorkspaceStatus.proc.removeDep(...modulesToRemove);
        }
      });
  });

  cb();
};

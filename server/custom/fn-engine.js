'use strict';
const fs = require('fs');
const path = require('path');

module.exports = function(app) {
  let files = fs
  .readdirSync(path.resolve(__dirname, '../functions'));

  for (let fileName of files) {
    let fnModule = require(path.resolve(__dirname, '../functions', fileName));
    let name = fileName.replace('.js', ''); // TODO: use UI name

    emulateServerlessFunction(app, name, fnModule);
    console.log(fileName);
  }
};

function emulateServerlessFunction(app, name, fnModule) {
  let TestModel = app.registry.createModel(name, {},
    {
      dataSource: 'Memory', // TODO: take DS name from request
      base: 'PersistedModel',
      plural: name,
      public: true,
      'remoting': {
        'sharedMethods': {
          '*': false, //THIS should work, but it is not, see disableRemoteMethod
        },
      },
    }
);
  app.model(TestModel);
  TestModel[name] = function(cb) {
    console.log('executing', name);
    cb(null, 'ttt' + fnModule[name](app));
  };
  TestModel.remoteMethod(name, {
    returns: {arg: 'result', type: 'object'},
    http: {path: '/', verb: 'get'},
  });
// WTF 1? remoteMethod declarations must be before disable
// WTF 2? why I cannot disable them all at once
  TestModel.disableRemoteMethod('count', true);
  TestModel.disableRemoteMethod('findById', true);
  TestModel.disableRemoteMethod('updateById', true);
  TestModel.disableRemoteMethod('find', true);
  TestModel.disableRemoteMethod('findOne', true);
  TestModel.disableRemoteMethod('exists', true);
  TestModel.disableRemoteMethod('updateAll', true);
  TestModel.disableRemoteMethod('createChangeStream', true);
  TestModel.disableRemoteMethod('upsertWithWhere', true);
  TestModel.disableRemoteMethod('deleteById', true);
  TestModel.disableRemoteMethod('update', true);
  TestModel.disableRemoteMethod('deleteAll', true);
  TestModel.disableRemoteMethod('updateAll', true);
  TestModel.disableRemoteMethod('patchOrCreateWithWhere', true);
  TestModel.disableRemoteMethod('upsert', true);
  TestModel.disableRemoteMethod('replace', true);
  TestModel.disableRemoteMethod('replaceById', true);
  TestModel.disableRemoteMethod('patchOrCreate', true);
  TestModel.disableRemoteMethod('replaceOrCreate', true);
  TestModel.disableRemoteMethod('create', true);
  TestModel.disableRemoteMethod('updateOrCreate', true);
  TestModel.disableRemoteMethod('findOrCreate', true);
}


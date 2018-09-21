let DirectoryAsObject = require('directory-as-object');
const path = require('path');
const {saveToGit} = require('../lib/util');
let fileProvider = new DirectoryAsObject({
  rootPath: path.join(process.cwd(), 'workspace'),
  ignorePatterns: [/node_modules/, /\.git/, /package-lock\.json/, /yarn\.lock/, /lunchbadger\.json/]
});
module.exports = function (WorkspaceFiles) {
  WorkspaceFiles.getFiles = function (cb) {
    fileProvider.serialize().then(data => cb(null, data));
  };
  WorkspaceFiles.updateFiles = function ({files}, cb) {
    fileProvider.deserialize(files).then(() => {
      saveToGit('LunchBadger: Files updated', cb);
    });
  };
  WorkspaceFiles.remoteMethod('getFiles', {
    description: 'get all files recursively from /workspace folder',
    isStatic: true,
    returns: {arg: 'files', type: 'object', root: false},
    http: { path: '/files', verb: 'get' }
  });
  WorkspaceFiles.remoteMethod('updateFiles', {
    description: 'updates all files recursively from /workspace folder',
    isStatic: true,
    accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
    returns: {arg: 'files', type: 'object', root: false},
    http: { path: '/files', verb: 'put' }
  });
};

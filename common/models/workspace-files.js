module.exports = function (WorkspaceFiles) {
  WorkspaceFiles.updateAll = function () {
    console.log(arguments);
  };
};

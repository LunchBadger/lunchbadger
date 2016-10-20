'use strict';

const path = require('path');

process.env.WORKSPACE_DIR = path.normalize(path.join(__dirname, '../../workspace'));
const workspace = require('loopback-workspace');

module.exports = function(app) {
  workspace.listen(app.get('workspacePort'), app.get('host'), function() {
    console.log(`Managing workspace in ${process.env.WORKSPACE_DIR}`);
    console.log(`Workspace listening at http://${app.get('host')}:${app.get('workspacePort')}`);
  });
};

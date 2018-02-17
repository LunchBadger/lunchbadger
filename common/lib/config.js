const path = require('path');
const userEnv = process.env.LB_ENV || 'dev';

module.exports = {
  userEnv: userEnv,
  branch: 'master',
  userName: process.env.LB_USER || 'workspace',
  gitUrl: process.env.GIT_URL || 'git@gitea.local.io:customer-demo/dev.git',
  urlPrefix: process.env.WORKSPACE_URL_PREFIX,
  watchUrl: process.env.WATCH_URL ||
    `http://localhost:3002/change-stream/demo`,
  workspaceDir: path.normalize(path.join(__dirname, '../../workspace'))
};

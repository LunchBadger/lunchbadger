'use strict';

const path = require('path');

const userEnv = process.env.LB_ENV || 'dev';

module.exports = {
  userEnv: userEnv,
  //branch: `env/${userEnv}`,
  branch: 'features/service-and-api-endpoints',
  userName: process.env.LB_USER || 'workspace',
  gitUrl: process.env.GIT_URL || 'http://localhost:3002/git/demo.git',
  urlPrefix: process.env.WORKSPACE_URL_PREFIX,
  watchUrl: process.env.WATCH_URL ||
    `http://localhost:3002/api/producers/demo/change-stream`,
  workspaceDir: path.normalize(path.join(__dirname, '../../workspace'))
};

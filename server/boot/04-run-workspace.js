'use strict';

const config = require('../../common/lib/config');
const path = require('path');
const WsManager = require('../../common/lib/wsmanager');
const debug = require('debug')('lunchbadger-workspace:workspace');

module.exports = function (app, cb) {
  const wsStatus = app.models.Project.workspaceStatus;

  let options = {
    cwd: config.workspaceDir,
    watch: [config.workspaceDir],
    ignore: [path.join(config.workspaceDir, 'package.json')],
    script: 'server/server.js',
    delay: 750,
    stdout: false
  };
  if (process.env.WORKSPACE_URL_PREFIX) {
    options.env = {
      LOOPBACK_URL_PREFIX: process.env.WORKSPACE_URL_PREFIX
    };
  }

  let proc = WsManager(options);

  let output = '';
  let debounce = null;

  proc.on('stderr', buf => {
    output += buf.toString('utf-8');
  });

  proc.on('stdout', buf => {
    output += buf.toString('utf-8');
  });

  function changeStatus (running, output) {
    if (debounce) {
      clearTimeout(debounce);
    }

    debounce = setTimeout(() => {
      wsStatus.status = running ? 'running' : 'crashed';
      wsStatus.output = output;
      wsStatus.save();
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

  proc.on('install_started', (args) => {
    const yarnArgs = args.join(' ');
    debug(`dependency install started (${yarnArgs})`);
    wsStatus.status = 'installing';
    wsStatus.output = 'Now running "yarn ' + yarnArgs + '"';
    wsStatus.save();
  });

  proc.on('install_success', () => {
    debug('dependency install success');
  });

  proc.on('install_error', output => {
    debug(`dependency installation error: ${output}`);
    changeStatus(false, output);
  });

  wsStatus.constructor.proc = proc;

  cb();
};

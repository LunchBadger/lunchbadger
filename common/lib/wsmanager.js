const nodemon = require('nodemon');
const path = require('path');
const spawn = require('child_process').spawn;


function WsManager(options) {
  const result = Object.create(nodemon(options));
  return Object.assign(result, WsManager.prototype);
}

WsManager.prototype.reinstallDeps = function() {
  this.emit('install_started');

  const installer = spawn('yarn', ['install', '--json'], {
    cwd: 'workspace'
  });

  let errors = [];

  const processMsg = data => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (_err) {
      return;
    }

    /*
    Messages look like this:

    { type: 'step', data: { message: 'Resolving packages', current: 1, total: 4 } }

    { type: 'activityStart', data: { id: 0 } }
    { type: 'activityTick', data: { id: 0, name: 'compression@^1.0.3' } }
    { type: 'activityEnd', data: { id: 0 } }

    {"type":"progressStart","data":{"id":0,"total":397}}
    { type: 'progressTick', data: { id: 2, current: 10033 } }
    {"type":"progressFinish","data":{"id":3}}

    {"type":"activitySetStart","data":{"id":1,"total":0,"workers":5}}
    {"type":"activitySetEnd","data":{"id":1}}

    { type: 'success', data: 'Already up-to-date.' }
    { type: 'finished', data: 367 }
    */

    if (msg.type === 'error') {
      errors.push(msg.data);
    }
  }

  installer.stdout.on('data', processMsg);
  installer.stderr.on('data', processMsg);

  installer.on('exit', (code, signal) => {
    if (code !== 0) {
      this.emit('install_error',
        `Dependency install failed:\n${errors.join('\n')}`);
    } else if (signal !== null) {
      this.emit('install_error',
        `Dependency install killed by signal ${signal}`);
    } else {
      this.emit('install_success');
      this.restart();
    }
  });
};

module.exports = WsManager;

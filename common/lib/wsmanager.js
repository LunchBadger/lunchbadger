'use strict';

const nodemon = require('nodemon');
const nodemonBus = require('nodemon/lib/utils/bus');
const spawn = require('child_process').spawn;
const debug = require('debug')('lunchbadger-workspace:wsmanager');

function WsManager(options) {
  const obj = nodemon(options);
  const result = Object.create(obj);
  return Object.assign(result, WsManager.prototype, {
    yarnPromise: Promise.resolve(),
    yarnsQueued: 0
  });
}

WsManager.prototype.reinstallDeps = function() {
  return this._queueYarn(['install']);
};

WsManager.prototype.addDep = function(pkgName) {
  return this._queueYarn(['add', pkgName]);
};

WsManager.prototype.removeDep = function(pkgName) {
  return this._queueYarn(['remove', pkgName]);
};

WsManager.prototype._queueYarn = function(args) {
  if (!this.yarnsQueued) {
    this.pauseWatching();
  }

  this.yarnsQueued++;
  debug(`yarn runs in queue: ${this.yarnsQueued}`);

  const finish = () => {
    this.yarnsQueued--;
    debug(`yarn runs in queue: ${this.yarnsQueued}`);

    if (!this.yarnsQueued) {
      this.resumeWatching();
    }
  };

  this.yarnPromise = this.yarnPromise.then(() => {
    return this._runYarn(args);
  }).catch(_err => {
    return this._runYarn(args);
  }).then(() => {
    finish();
  }).catch(_err => {
    finish();
  });
};

WsManager.prototype._runYarn = function(args) {
  this.emit('install_started', args);

  const installer = spawn('yarn', args.concat('--json'), {
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
    Possible future extension is to send progress messages.
    Messages from Yarn look like this:

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
  };

  installer.stdout.on('data', processMsg);
  installer.stderr.on('data', processMsg);

  const promise = new Promise((resolve, reject) => {
    installer.on('exit', (code, signal) => {
      if (code !== 0) {
        const msg = `Dependency install failed:\n${errors.join('\n')}`;
        reject(msg);
        this.emit('install_error', msg);
      } else if (signal !== null) {
        const msg = `Dependency install killed by signal ${signal}`;
        reject(msg);
        this.emit('install_error', msg);
      } else {
        this.emit('install_success');
        resolve();
        this.restart();
      }
    });
  });

  return promise;
};

/*
NB: Giant hack that makes use of nodemon implementation details. A better
    way to do this would be to just not use nodemon due to its multiple
    problems.
*/
let paused = false;
let restartNeeded = false;

WsManager.prototype.pauseWatching = function() {
  if (paused) {
    return;
  }

  debug('pause watching workspace');
  paused = true;
};

WsManager.prototype.resumeWatching = function() {
  if (!paused) {
    return;
  }

  debug('resume watching workspace');
  paused = false;

  if (restartNeeded) {
    debug('restarting due to changes during pause');
    nodemonBus.emit('restart');
    restartNeeded = false;
  }
};

const superEmit = nodemonBus.emit;
nodemonBus.emit = function(event, ...args) {
  if (paused && event === 'restart') {
    restartNeeded = true;
    return;
  }

  return superEmit.call(this, event, ...args);
};
/* End of hack */

module.exports = WsManager;

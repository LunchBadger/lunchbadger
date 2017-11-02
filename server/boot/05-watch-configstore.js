const EventSource = require('eventsource');
const uuidv1 = require('uuid').v1;
const debug = require('debug')('lunchbadger-workspace:workspace');

const config = require('../../common/lib/config');
const {reset} = require('../../common/lib/util');
const {ensureProjectFileExists} = require('../../common/lib/wsinit');

const DETACHED = '0000000000000000000000000000000000000000';

module.exports = function (app, cb) {
  const status = app.models.Project.workspaceStatus;
  const branch = config.branch;

  const watchUrl = (process.env.WATCH_URL ||
    'http://localhost:3002/api/producers/demo/change-stream');
  let connected = false;
  let es = new EventSource(watchUrl);
  es.addEventListener('data', async message => {
    let statusUpdate = JSON.parse(message.data);
    let doReset = false;

    if (statusUpdate.type === 'push') {
      debug('git push detected');

      for (const change of statusUpdate.changes) {
        if (change.type === 'head' && change.ref === branch) {
          if (change.after !== status.revision && change.after !== DETACHED) {
            debug(`${branch} changed from ${status.revision} to ${change.after}`);
            doReset = true;
          }
          break;
        }
      }
    } else if (statusUpdate.type === 'initial') {
      debug('received initial branch status');

      for (const ref of Object.keys(statusUpdate.branches)) {
        if (ref === branch) {
          const newRev = statusUpdate.branches[ref];
          if (newRev !== status.revision && newRev !== DETACHED) {
            debug(`${branch} changed from ${status.revision} to ${newRev}`);
            doReset = true;
          }
          break;
        }
      }
    }

    if (doReset) {
      debug('resetting workspace');
      status.instance = uuidv1();
      try {
        await status.save();
        await reset(branch);
        await ensureProjectFileExists();
        await app.models.WorkspaceStatus.proc.reinstallDeps();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      };
    }
  });

  es.addEventListener('open', () => {
    if (!connected) {
      debug('connected to configstore');
      connected = true;
    }
  });

  es.addEventListener('error', (_err) => {
    if (connected !== false) {
      debug('disconnected from configstore');
      connected = false;
    }
  });

  cb();
};

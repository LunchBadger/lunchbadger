const EventSource = require('eventsource');
const uuidv1 = require('uuid').v1;
const debug = require('debug')('lunchbadger-workspace:workspace');

const config = require('../../common/lib/config');
const {reset, rev} = require('../../common/lib/util');
const {ensureProjectFileExists} = require('../../common/lib/wsinit');

module.exports = function (app, cb) {
  const branch = config.branch;
  const status = app.models.Project.workspaceStatus;
  const watchUrl = (process.env.WATCH_URL ||
    'http://localhost:3002/change-stream/demo');
  let connected = false;
  let es = new EventSource(watchUrl);
  es.addEventListener('data', async message => {
    debug('SSE event inbound');
    let statusUpdate = JSON.parse(message.data);
    debug(statusUpdate);
    let doReset = false;

    if (statusUpdate.type === 'push') {
      let revision = rev();
      // The idea is to filter out events that have same commit hash as local
      // If commit was not driven by LB, then local version will not match external
      // If the sha hash is the same == it was LBWS who pushed the code
      debug(`local ${branch} ${revision}`);
      if (statusUpdate.ref.indexOf('/' + branch) >= 0) {
        debug(`branch matched ${statusUpdate.ref}`);
        if (statusUpdate.after !== revision) {
          debug('upstream revision changed, updating local repo');
          doReset = true;
        } else {
          debug('upstream version is the same as local');
        }
      }
    }

    if (doReset) {
      // status.instance is The magic property to notify UI that it should force reload
      status.instance = uuidv1();
      debug('resetting workspace');
      try {
        reset(branch);
        ensureProjectFileExists();
        await status.save();
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

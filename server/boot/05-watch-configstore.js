const EventSource = require('eventsource');
const uuid = require('uuid').v1;
const debug = require('debug')('lunchbadger-workspace:workspace');

const config = require('../../common/lib/config');
const {reset} = require('../../common/lib/util');
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
      doReset = statusUpdate.isExternal;
    }
    if (statusUpdate.repoName === 'dev') {
      status.ws_git = statusUpdate.after;
    } else {
      status.fn_git = statusUpdate.after;
    }

    if (doReset) {
      // status.instance is The magic property to notify UI that it should force reload
      try {
        if (statusUpdate.repoName === 'dev') {
          debug('resetting workspace');

          status.instance = uuid();
          reset(branch);
          ensureProjectFileExists();
          await status.save();
          await app.models.WorkspaceStatus.proc.reinstallDeps();
        } else {
          debug('resetting functions state');
          status.sls_api = uuid();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      };
    }
    await status.save();
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

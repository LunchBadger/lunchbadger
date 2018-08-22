const uuidv1 = require('uuid').v1;
const {ensureWorkspace} = require('../../common/lib/wsinit');
const debug = require('debug')('lunchbadger-workspace:init:3');

module.exports = async (app, cb) => {
  try {
    let rev = await ensureWorkspace(app);
    const id = uuidv1();
    debug('Starting App with id ', id);
    let status = await app.models.WorkspaceStatus.create({
      running: false,
      output: '',
      instance: id,
      revision: rev
    });
    app.models.Project.workspaceStatus = status;
    cb();
  } catch (err) {
    debug(err);
    cb(err);
  }
};

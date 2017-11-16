const uuidv1 = require('uuid').v1;
const {ensureWorkspace} = require('../../common/lib/wsinit');

module.exports = async (app, cb) => {
  try {
    let rev = await ensureWorkspace(app);
    let status = await app.models.WorkspaceStatus.create({
      running: false,
      output: '',
      instance: uuidv1(),
      revision: rev
    });
    app.models.Project.workspaceStatus = status;
    cb();
  } catch (err) {
    cb(err);
  }
};

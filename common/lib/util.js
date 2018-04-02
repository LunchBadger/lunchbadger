const util = require('util');
const exec = util.promisify(require('child_process').exec);
const debug = require('debug')('lunchbadger-workspace:workspace');

async function execWs (cmd) {
  let res = await exec(cmd, {cwd: process.env.WORKSPACE_DIR});
  return res.stdout;
}

async function commit () {
  await execWs('git add -A');
  await execWs('git commit -m "Changes via LunchBadger"');
  let rev = await execWs('git show --format="format:%H" -s');
  return rev.trim();
}

function push (branch) {
  return execWs(`git push origin ${branch}`)
    .then(() => true)
    .catch((err) => {
      if (err.message.includes('[rejected]')) {
        return reset(branch).then(() => false);
      } else {
        throw err;
      }
    });
}

async function reset (branch) {
  await execWs('git fetch');
  debug(`git reset --hard origin/${branch}`);
  return execWs(`git reset --hard origin/${branch}`);
}

async function selfDestruct () {
  debug('Instructed to shutdown process');
  process.exit(999);
}

module.exports = {
  execWs,
  commit,
  push,
  reset,
  selfDestruct
};

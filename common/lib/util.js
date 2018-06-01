const cp = require('child_process');
const debug = require('debug')('lunchbadger-workspace:workspace');
const debuggit = require('debug')('lunchbadger-workspace:git');

function execWs (cmd) {
  let res = cp.execSync(cmd, {cwd: process.env.WORKSPACE_DIR, encoding: 'UTF-8'});
  debuggit(cmd, res);

  return res;
}

function commit () {
  execWs('git add -A');
  execWs('git commit -m "Changes via LunchBadger"');
  let rev = execWs('git show --format="format:%H" -s');
  return rev.trim();
}

function push (branch) {
  try {
    execWs(`git push origin ${branch}`);
    return true;
  } catch (err) {
    if (err.message.includes('[rejected]')) {
      reset(branch);
      return false;
    } else {
      throw err;
    }
  }
}

function reset (branch) {
  execWs('git fetch');
  debug(`git reset --hard origin/${branch}`);
  return execWs(`git reset --hard origin/${branch}`);
}

async function selfDestruct () {
  debug('Instructed to shutdown process');
  process.exit();
}

module.exports = {
  execWs,
  commit,
  push,
  reset,
  selfDestruct
};

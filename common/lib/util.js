const cp = require('child_process');
const debug = require('debug')('lunchbadger-workspace:workspace');
const debuggit = require('debug')('lunchbadger-workspace:git');

function execWs (cmd) {
  let res = cp.execSync(cmd, {cwd: process.env.WORKSPACE_DIR, encoding: 'UTF-8'});
  debuggit(cmd, res);
  return res;
}
function revs () {
  // it can be a lot of revisions, let's keep it to latest 20 min (random number)
  let output = execWs('git log --format="format:%H" --since="20 minutes"');
  debuggit('local revisions log', output);
  return output ? output.split('\n') : [];
}

function commit (msg = 'Changes via LunchBadger') {
  execWs('git add -A');
  execWs(`git commit -m "${msg}"`);
  let rev = execWs('git show --format="format:%H" -s');
  return rev.trim();
}

function push (branch) {
  try {
    // --porcelain => machine readable output in stdout
    //  <flag> \t <from>:<to> \t <summary> (<reason>) see https://git-scm.com/docs/git-push
    let result = execWs(`git push origin ${branch} --porcelain`);
    debuggit(result);
    return true;
  } catch (err) {
    debug(err);
    if (err.message.includes('!')) { // flag '!' means rejected
      debug('Conflict: resetting to latest upstream');
      reset(branch);
      return false;
    } else { // Connection errors etc. 
      throw err;
    }
  }
}

function saveToGit (msg, next) {
  let stdout = execWs('git status');
  // Commit, if necessary
  if (!stdout.includes('nothing to commit')) {
    debug('changes detected, committing');
    let rev = commit(msg);
    debuggit('new revision after commit', rev);
  } else {
    debug('nothing to commit');
  }
  next(null);
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
  revs,
  push,
  saveToGit,
  reset,
  selfDestruct
};

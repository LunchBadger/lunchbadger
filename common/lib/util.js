const cp = require('child_process');
const debug = require('debug')('lunchbadger-workspace:workspace');
const debuggit = require('debug')('lunchbadger-workspace:git');
const config = require('./config');
function execWs (cmd) {
  let res = cp.execSync(cmd, {cwd: process.env.WORKSPACE_DIR, encoding: 'UTF-8'});
  debuggit(cmd, res);
  return res;
}
function rev () {
  let rev = execWs('git show --format="format:%H" -s');
  debuggit('local revision', rev);
  return rev;
}

function commit (msg = 'Changes via LunchBadger') {
  execWs('git add -A');
  execWs(`git commit -m "${msg}"`);
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

function saveToGit (msg, next) {
  let success;
  let stdout = execWs('git status');
  // Commit, if necessary
  if (!stdout.includes('nothing to commit')) {
    debug('changes detected, committing');
    let rev = commit(msg);
    debuggit('new revision after commit', rev);
  } else {
    debug('nothing to commit');
  }
  // Push to Git
  debug('pushing');
  success = push(config.branch);

  // Return result
  if (!success) {
    debug('conflict detected');
    let err = new Error('Conflict in Git repository');
    err.status = 409;
    next(err);
  } else {
    next(null);
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
  rev,
  push,
  saveToGit,
  reset,
  selfDestruct
};

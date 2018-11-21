const cp = require('child_process');
const debug = require('debug')('lunchbadger-workspace:workspace');

function execWs (cmd) {
  try {
    let res = cp.execSync(cmd, {
      cwd: process.env.WORKSPACE_DIR,
      encoding: 'UTF-8'
    });
    return res;
  } catch (err) {
    debug(cmd, err);
    throw err;
  }
}

async function execWsAsync (cmd) {
  return new Promise((resolve, reject) => {
    cp.exec(cmd, {cwd: process.env.WORKSPACE_DIR}, (err, stdout, stderr) => {
      if (err) {
        debug(err);
        return reject(err);
      }
      resolve(stdout);
    });
  });
}

function revs () {
  // it can be a lot of revisions, let's keep it to latest 20 min (random number)
  let output = execWs('git log --format="format:%H" --since="20 minutes"');
  return output ? output.split('\n') : [];
}

function commit (msg = 'Changes via LunchBadger') {
  execWs('git add -A');
  execWs(`git commit -m "${msg}"`);
  let rev = execWs('git show --format="format:%H" -s');
  return rev.trim();
}
let lock = false;
async function push (branch) {
  if (lock) {
    return true;
  }
  try {
    // git push does request to actual git server
    // And it takes time to process ssh key, so it can overload git server
    // Every 10 sec push with 30 users overloads gitea
    // So we need to push only if new commits have been added
    // git log origin/master..master gives empty string if no new commits
    let hasNewCommits = await execWsAsync(`git log origin/${branch}..${branch}`);
    if (!hasNewCommits) { return true; }

    // --porcelain => machine readable output in stdout 
    //  <flag> \t <from>:<to> \t <summary> (<reason>) see https://git-scm.com/docs/git-push
    // Note async version usage: 
    // sync version will block process for time to push (5 sec) and readyness probe will fail
    lock = true;
    await execWsAsync(`git pull origin ${branch} --rebase && (git rebase --abort || true)`);
    // rebase abort in case we enter some conflict
    await execWsAsync(`git push origin ${branch} --porcelain`);
    debug('pushing');
    lock = false;
    return true;
  } catch (err) {
    debug(err);
    if (err.message.includes('!')) { // flag '!' means rejected
      debug('Conflict: resetting to latest upstream');
      reset(branch);
      lock = false;
      return false;
    } else { // Connection errors etc. 
      debug(err);
      lock = false;
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
    debug('new revision after commit', rev);
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

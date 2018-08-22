const cp = require('child_process');
const debug = require('debug')('lunchbadger-workspace:workspace');
const debuggit = require('debug')('lunchbadger-workspace:git');

function execWs (cmd) {
  let res = cp.execSync(cmd, {cwd: process.env.WORKSPACE_DIR, encoding: 'UTF-8'});
  debuggit(cmd, res);
  return res;
}

async function execWsAsync (cmd) {
  let res = await cp.exec(cmd, {cwd: process.env.WORKSPACE_DIR});
  let output = await streamToString(res.stdout);
  debuggit(cmd, output);
  return output;
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
    // git push does request to actual git server
    // And it takes time to process ssh key, so it can overload git server
    // Every 10 sec push with 30 users overloads gitea
    // So we need to push only if new commits have been added
    // git log origin/master..master gives empty string if no new commits
    let hasNewCommits = execWsAsync(`git log origin/${branch}..${branch}`);
    if (!hasNewCommits) { return true; }

    // --porcelain => machine readable output in stdout 
    //  <flag> \t <from>:<to> \t <summary> (<reason>) see https://git-scm.com/docs/git-push
    // Note async version usage: 
    // sync version will block process for time to push (5 sec) and readyness probe will fail
    let result = execWsAsync(`git push origin ${branch} --porcelain`);
    debuggit(result);
    return true;
  } catch (err) {
    debug(err);
    if (err.message.includes('!')) { // flag '!' means rejected
      debug('Conflict: resetting to latest upstream');
      reset(branch);
      return false;
    } else { // Connection errors etc. 
      debug(err);
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

function streamToString (stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunks.push);
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
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

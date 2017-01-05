const promisify = require('es6-promisify');
const exec = promisify(require('child_process').exec);

function execWs(cmd) {
  return exec(cmd, {cwd: process.env.WORKSPACE_DIR});
}

function commit() {
  return execWs('git add -A')
    .then(() => {
      return execWs('git commit -m "Changes via LunchBadger"');
    })
    .then(() => {
      return execWs('git show --format="format:%H" -s');
    })
    .then(rev => {
      return rev.trim();
    });
}

function push(branch) {
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

function reset(branch) {
  return execWs(`git reset --hard origin/${branch}`)
    .then(() => {
      return execWs(`git pull origin ${branch}`);
    });
}

module.exports = {
  execWs,
  commit,
  push,
  reset
};

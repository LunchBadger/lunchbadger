#!/usr/bin/env node
var fs = require('fs');
require('shelljs/global');

var args = process.argv.slice(2);

if (!fs.existsSync('./client/index.html') || args.indexOf('force') > -1) {
  // make tmp and client
  exec('mkdir tmp');
  exec('mkdir client');
  cd('tmp');

// pull container
  exec('git clone git@github.com:LunchBadger/lunchbadger-container.git >/dev/null 2>&1');

// build container (verify and install)
  cd('lunchbadger-container');
  echo('Installing application, please wait...');

  if (args.indexOf('local') > -1) {
    exec('npm install --silent && npm run dist:local');
  } else {
    exec('npm install --silent && npm run dist');
  }

// copy dist
  cd('..');
  cd('..');
  exec('cp ./tmp/lunchbadger-container/dist/* ./client');

// remove tmp
  exec('rimraf ./tmp/*');
} else {
  echo('App is already installed, to start run npm start');
  echo('To reinstall type npm run dist force');
}

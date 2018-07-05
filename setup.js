const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const DIR = path.join(
  os.tmpdir(),
  'jest_puppeteer_global_setup',
);

function startMainProcess() {
  const mainProcess = spawn('yarn', ['start']);
  return new Promise(resolve => {
    mainProcess.stdout.on('data', data => {
      console.log(`${chalk.green('MAIN:')} ${data}`);
      if (data.indexOf('http://localhost:3000') >= 0) {
        resolve(mainProcess);
      }
    });
    mainProcess.stderr.on('data', data => {
      console.log(`${chalk.red('MAIN:')}: ${data}`);
    });
    mainProcess.on('close', (code, signal) => {
      if (signal === 'SIGTERM') return;
      if (code !== 0) {
        process.exit(code);
      }
    });
  });
}

module.exports = async function() {
  console.log(chalk.green('Setup main process'));
  global.__PROCESS__ = await startMainProcess();
  console.log(chalk.green('Setup Puppeteer'));
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  global.__BROWSER__ = browser;
  mkdirp.sync(DIR);
  fs.writeFileSync(
    path.join(DIR, 'wsEndpoint'),
    browser.wsEndpoint(),
  );
};

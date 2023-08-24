#! /usr/bin/env node
const yargs = require('yargs');
const fs = require('fs')
const { mdLinks } = require('../index.js');
const {
  calculateStatistics,
  printStatistics,
  printValidationResult,
} = require('../functions.js')
const path = require('path');
const chalk = require('chalk');
const boxen = require('boxen');

console.log(boxen('Welcome!', { padding: 1, borderStyle: 'round' }));

const options = yargs(process.argv.slice(2))
  .usage('md-links ./path/to/file.md -v -s')
  .option('v', {
    alias: 'validate',
    describe: (chalk.yellow('When selecting this option, the links are validated')),
    type: 'boolean',
    demandOption: false,
  })
  .option('s', {
    alias: 'stats',
    describe: 'When selecting this option, statistics about the links are printed',
    type: 'boolean',
    demandOption: false
  })
  .help(true)
  // .demandCommand()
  .argv;

mdLinks(options._[0], options)
  .then(links => {
    if (options.stats) {
      let stats = calculateStatistics(links, options.validate);
      printStatistics(stats);
    } else {
      printValidationResult(links);
    }
  });
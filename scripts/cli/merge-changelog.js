const yargs = require('yargs');

const run = require('../merge-changelog');

const argv = yargs
  .option('path', {
    describe: '指定需要合并的 changelog 路径',
  })
  .option('debug', {
    describe: '开启调试模式',
  }).argv;

run(argv);

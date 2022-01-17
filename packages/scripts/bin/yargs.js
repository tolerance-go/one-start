#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .command(
    'check-used-depends-must-in-pkg',
    '检查使用但是未声明依赖',
    (scope) => {
      //   return scope.positional('port', {
      //     describe: 'port to bind on',
      //     default: 5000,
      //   });
    },
    (argv) => {
      require(`../es/check-used-depends-must-in-pkg.js`)?.run?.();
    },
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: '打印额外信息，比如 debug 信息',
  })
  .parse();

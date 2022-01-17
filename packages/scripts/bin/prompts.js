#!/usr/bin/env node

'use strict';

const prompts = require('prompts');

(async () => {
  const response = await prompts([
    {
      type: 'select',
      name: 'scriptName',
      message: '需要指定运行的脚本名称',
      choices: [{ title: '找到所有使用但是未声明的依赖', value: 'check-used-depends-must-in-pkg' }],
    },
  ]);

  require(`../es/${response.scriptName}.js`)?.run?.();
})();

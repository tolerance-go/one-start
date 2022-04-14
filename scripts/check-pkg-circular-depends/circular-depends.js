const madge = require('madge');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const getPaths = () => {
  const paths = fs
    .readdirSync(path.join(process.cwd(), 'packages'))
    .filter((item) => item.charAt(0) !== '.')
    .map((package) => path.join(process.cwd(), `packages/${package}/src`));
  return paths;
};

const run = () => {
  console.log(getPaths());
  return madge(getPaths(), {
    detectiveOptions: {
      ts: {
        skipTypeImports: true,
      },
    },
    fileExtensions: ['ts', 'tsx'],
    tsConfig: path.join(process.cwd(), 'tsconfig.json'),
  }).then((res) => {
    const circulars = res.circular();
    if (circulars.length > 0) {
      console.log(res.circularGraph());
      console.log(chalk.red(`模块内部存在 ${circulars.length} 个循环依赖`));
      return false;
    }
    console.log(chalk.green('模块内部不存在循环依赖'));
    return true;
  });
};

module.exports = run;

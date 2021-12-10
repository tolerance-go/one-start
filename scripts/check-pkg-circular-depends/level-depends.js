const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const getImports = require('../utils/get-imports');

const packagesPath = path.join(process.cwd(), 'packages');
const settings = require(path.join(process.cwd(), 'settings.json'));

const pkgs = fs
  .readdirSync(packagesPath)
  .map((name) => {
    if (name.startsWith('.')) {
      return;
    }
    return name;
  })
  .filter(Boolean);

const run = () => {
  const errors = pkgs.reduce((errors, pkgName) => {
    const pkgLocalPath = path.join(packagesPath, pkgName);

    const { inners, tyPkgs, external } = getImports(path.join(pkgLocalPath, 'src'));

    const mergedDepends = [...inners, ...tyPkgs, ...external];

    const dependsPrefixChain = settings.headPkgs;
    dependsPrefixChain.forEach((lowLevel, index) => {
      if (pkgName.startsWith(lowLevel)) {
        const highLevels = dependsPrefixChain.slice(index + 1);
        const errorDepends = highLevels.filter((item) => {
          return mergedDepends.some((key) => {
            return key.startsWith(`@${settings.scope}/${item}`);
          });
        });
        if (errorDepends.length > 0) {
          errors += `${chalk.red(`${pkgName}:`)} 存在分层依赖错误，不应该依赖以下上层模块: `;
          errors += `${chalk.blueBright(errorDepends.join(', '))}\n`;
        }
      }
    });

    return errors;
  }, '');

  if (errors) {
    console.log(errors);
    console.log(chalk.red('分层依赖检查存在错误'));
    return false;
  } else {
    console.log(chalk.green('分层依赖检查正常'));
    return true;
  }
};

module.exports = run;

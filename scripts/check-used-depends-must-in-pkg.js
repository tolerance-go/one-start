const getAllPkgs = require('./utils/get-all-pkgs');
const path = require('path');
const getImports = require('./utils/get-imports');
const chalk = require('chalk');
const settings = require(path.join(process.cwd(), 'settings.json'));

const run = () => {
  const allPkgs = getAllPkgs();
  const packagesPath = path.join(process.cwd(), 'packages');
  const errors = allPkgs.reduce((errors, pkgName) => {
    const pkgLocalPath = path.join(packagesPath, pkgName);

    const { inners, tyPkgs, external } = getImports(path.join(pkgLocalPath, 'src'));
    const pkgConfig = require(path.join(pkgLocalPath, 'package.json'));
    // 声明的依赖
    const statementDepends = Object.keys(pkgConfig.dependencies || {}).concat(
      Object.keys(pkgConfig.peerDependencies || {}),
    );
    // 使用的依赖
    const usedDepends = [...inners, ...tyPkgs, ...external];
    usedDepends.forEach((used) => {
      // 把自己包括，使用的依赖中有 demo 文件，包含了自己
      if (
        [...statementDepends, pkgConfig.name].find((item) => {
          // antd/lib/button -> antd
          // @ty-one-start/services-xxx -> @ty-one-start/services
          return used === item || (used.startsWith(item) && used[item.length] === '/');
        }) == null
      ) {
        if (!(settings.ignoreUsedPkgsCheck || []).includes(used)) {
          errors.push(
            chalk.red(
              `${pkgName} 存在使用的依赖 ${used}，但是没有在 package.json 中声明，请添加后重试`,
            ),
          );
        }
      }
    });

    return errors;
  }, []);

  if (errors.length) {
    console.log(errors.join('\n'));
    process.exit(1);
  }

  console.log(chalk.green('模块没有使用但没有声明的依赖存在'));
};

run();

import { getAllPkgs } from './utils/get-all-pkgs';
import path from 'path';
import { getImports } from './utils/get-imports';
import chalk from 'chalk';
import { getSettings } from './utils/get-settings';

const run = () => {
  const allPkgs = getAllPkgs();
  const settings = getSettings();
  const packagesPath = path.join(process.cwd(), 'packages');
  const errors = allPkgs.reduce((errors_, pkgName) => {
    const pkgLocalPath = path.join(packagesPath, pkgName);

    const { inners, tyPkgs, external } = getImports(path.join(pkgLocalPath, 'src'));
    const pkgConfig = require(path.join(pkgLocalPath, 'package.json'));
    // 声明的依赖
    const statementDepends = Object.keys(pkgConfig.dependencies || {}).concat(
      Object.keys(pkgConfig.peerDependencies || {}),
    );
    // 使用的依赖
    const usedDepends = [...(inners ?? []), ...(tyPkgs ?? []), ...(external ?? [])];
    usedDepends.forEach((used) => {
      // 把自己包括，使用的依赖中有 demo 文件，包含了自己
      if (
        [...statementDepends, pkgConfig.name].find((item) => {
          // antd/lib/button -> antd
          // @ty-swap-pages/services-xxx -> @ty-swap-pages/services
          return used === item || (used.startsWith(item) && used[item.length] === '/');
        }) == null
      ) {
        if (!(settings.ignoreUsedPkgsCheck || []).includes(used)) {
          errors_.push(
            chalk.red(
              `${pkgName} 存在使用的依赖 ${used}，但是没有在 package.json 中声明，请添加后重试`,
            ),
          );
        }
      }
    });

    return errors_;
  }, [] as string[]);

  if (errors.length) {
    console.log(errors.join('\n'));
    process.exit(1);
  }

  console.log(chalk.green('模块没有使用但没有声明的依赖存在'));
};

export { run };

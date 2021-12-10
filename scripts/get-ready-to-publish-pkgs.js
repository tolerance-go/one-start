const path = require('path');
const fs = require('fs');
const { utils } = require('umi');
const settings = require(path.join(process.cwd(), 'settings.json'));
const invariant = require('invariant');

const main = ({ headPkgs = [] }) => {
  const headPkgNames = headPkgs.map((item) => `@${settings.scope}/${item}`);
  const { stdout } = utils.execa.sync(
    `${path.join(process.cwd(), 'node_modules', '.bin', 'lerna')}`,
    ['changed'],
  );
  const releasePkgNames = stdout.split('\n').filter(Boolean);

  const releaseHeadPkgNames = headPkgNames.filter((pkg) => releasePkgNames.includes(pkg));
  const tailPkgNames = releasePkgNames.filter(
    (pkg) => pkg.charAt(0) !== '.' && !releaseHeadPkgNames.includes(pkg),
  );

  return [...releaseHeadPkgNames, ...tailPkgNames].map((pkgName) => {
    const [, pkg] = pkgName.split('/');
    invariant(
      fs.existsSync(path.join(process.cwd(), 'packages', pkg)) === true,
      `${pkg} 不存在于 packages 文件夹下`,
    );
    return pkg;
  });
};

module.exports = main;

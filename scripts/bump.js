const path = require('path');
const fs = require('fs');
const { utils } = require('umi');
const formatContent = require('./utils/format-content');
const shell = require('shelljs');

const main = () => {
  const version = process.argv[process.argv.length - 1];

  console.log('修改 peer 版本号');

  const pkgs = fs
    .readdirSync(path.join(process.cwd(), 'packages'))
    .filter((item) => item.charAt(0) !== '.');

  const pkgItems = pkgs.map((pkg) => {
    const pkgJSON = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'packages', pkg, 'package.json'), 'utf8'),
    );
    return pkgJSON;
  });

  pkgs.forEach((pkg) => {
    const pkgJSON = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'packages', pkg, 'package.json'), 'utf8'),
    );

    if (pkgJSON.peerDependencies) {
      Object.keys(pkgJSON.peerDependencies).forEach((depName) => {
        const depPkg = pkgItems.find((item) => item.name === depName);
        if (depPkg) {
          const next = `${version.split('.')[0]}.x`;
          console.log(pkgJSON.name, 'peerDependencies', depName, '-->', next);
          pkgJSON.peerDependencies[depName] = next;
        }
      });

      fs.writeFileSync(
        path.join(process.cwd(), 'packages', pkg, 'package.json'),
        formatContent(
          path.join(process.cwd(), 'packages', pkg, 'package.json'),
          JSON.stringify({
            ...pkgJSON,
          }),
        ),
        {
          encoding: 'utf-8',
        },
      );
    }
  });

  console.log(`${path.join(process.cwd(), 'node_modules', '.bin', 'lerna')}`, [
    version,
    '--exact',
    '--conventional-commits',
    '--force-publish',
  ]);
  const shell = utils.execa.sync(
    `${path.join(process.cwd(), 'node_modules', '.bin', 'lerna')}`,
    ['version', version, '--exact', '--conventional-commits', '--force-publish'],
    { stdio: 'inherit' },
  );

  console.log('shell', shell);
};

main();

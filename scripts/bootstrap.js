const fs = require('fs-extra');
const path = require('path');
const settings = require(path.join(process.cwd(), 'settings.json'));
const package = require(path.join(process.cwd(), 'package.json'));
const { join } = path;
const ejs = require('ejs');
const chalk = require('chalk');
const formatContent = require('./utils/format-content');

const foreachTpls = (tplPath, callback, configs) => {
  const { parentPath = path.parse(tplPath).dir } = configs || {};
  if (fs.existsSync(tplPath)) {
    if (fs.statSync(tplPath).isDirectory()) {
      fs.readdirSync(tplPath).forEach((child) =>
        foreachTpls(path.join(tplPath, child), callback, {
          ...configs,
          parentPath: tplPath,
        }),
      );
    } else {
      callback({
        tplPath,
        parentPath,
      });
    }
  }
};

const version = '0.0.0-beta.1';

const pkgs = fs.readdirSync(join(__dirname, '../packages')).filter((pkg) => pkg.charAt(0) !== '.');

let tsPaths = {};

pkgs.forEach((shortName) => {
  const name = `@${settings.scope}/${shortName}`;
  const description = name;

  const pkgPath = path.join(__dirname, '..', 'packages', shortName);

  const bootstrapTplPath = path.join(__dirname, 'templates', 'bootstrap');

  if (fs.existsSync(path.join(pkgPath, 'package.json'))) {
    return;
  }

  const commonds = {
    navTitle: 'navTitle',
    groupTitle: 'groupTitle',
    title: shortName,
    breadcrumbName: shortName,
  };

  foreachTpls(bootstrapTplPath, (item) => {
    const relativePath = path.relative(bootstrapTplPath, item.tplPath);
    const dirRelativePath = path.relative(bootstrapTplPath, item.parentPath);
    const targetPath = path.join(pkgPath, relativePath);
    const targetDirPath = path.join(pkgPath, dirRelativePath);

    if (fs.existsSync(targetPath) === false) {
      const tplContent = fs.readFileSync(item.tplPath, {
        encoding: 'utf-8',
      });

      const renderData = {
        'package.json': {
          name,
          description,
          repository: package.repository,
          version,
        },
        'README.md': {
          name,
          description,
          shortName,
        },
        [path.join('src', 'docs', '$page.md')]: {
          navTitle: commonds.navTitle,
          groupTitle: commonds.groupTitle,
          title: commonds.title,
          groupPath: `/${shortName}`,
        },
        [path.join('src', 'demos', 'basic.tsx')]: {
          name,
        },
        [path.join('src', 'views', 'index.tsx')]: {
          name,
          title: commonds.title,
          breadcrumbName: commonds.breadcrumbName,
        },
      };

      const newContent = ejs.render(tplContent, renderData[relativePath]);

      const replaceFilename = (filePath) => {
        return filePath.replace('$page', shortName);
      };

      if (fs.existsSync(replaceFilename(targetDirPath)) === false) {
        fs.mkdirpSync(replaceFilename(targetDirPath));
      }

      fs.writeFileSync(replaceFilename(targetPath), newContent, {
        encoding: 'utf-8',
      });
    }
  });

  console.log(chalk.green(`${shortName} 初始化完成`));

  tsPaths = {
    ...tsPaths,
    [name]: [path.join('packages', shortName, 'src', 'index')],
  };
});

if (Object.keys(tsPaths).length) {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  const tsconfig = require(tsconfigPath);

  fs.writeFileSync(
    tsconfigPath,
    formatContent(
      tsconfigPath,
      JSON.stringify({
        ...tsconfig,
        compilerOptions: {
          ...tsconfig.compilerOptions,
          paths: {
            ...tsconfig.compilerOptions.paths,
            ...tsPaths,
          },
        },
      }),
    ),
    {
      encoding: 'utf-8',
    },
  );
}

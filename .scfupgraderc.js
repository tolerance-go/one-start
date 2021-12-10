const fs = require('fs');
const path = require('path');
const writePkg = require('write-pkg');
const inquirer = require('inquirer');

module.exports = {
  gitAddress: 'git@10.1.2.7:Visual-FE/create-pages-app.git',
  ignoreUpgradePaths: ['yarn.lock', '.yarn/*', 'packages/*'],
  ignoreInitPaths: ['.yarn/*', 'packages/*'],
  onInit: () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'package_name',
          message: '请输入 package name',
          validate: (value) => (value === '' ? '必填' : true),
        },
        {
          type: 'input',
          name: 'repository',
          message: '请输入仓库地址',
          validate: (value) => (value === '' ? '必填' : true),
        },
        {
          type: 'input',
          name: 'scope',
          message: '请输入 scope',
          validate: (value) => (value === '' ? '必填' : true),
        },
        {
          type: 'input',
          name: 'siteTitle',
          message: '请输入 siteTitle',
          validate: (value) => (value === '' ? '必填' : true),
        },
      ])
      .then((vars) => {
        writePkg.sync('package.json', {
          ...require(path.join(process.cwd(), 'package.json')),
          name: vars.package_name,
          repository: vars.repository,
        });
        fs.writeFileSync(
          path.join(process.cwd(), 'settings.json'),
          `{
  "headPkgs": [],
  "scope": "${vars.scope}",
  "siteTitle": "${vars.siteTitle}",
  "requestLibPath": "import { request } from '@${vars.scope}/utils';",
  "services": {}
}
`,
          { encoding: 'utf-8' },
        );
        fs.writeFileSync(
          path.join(process.cwd(), 'tsconfig.json'),
          `{
  "compilerOptions": {
    "resolveJsonModule": true,
    "baseUrl": "./",
    "target": "es6",
    "moduleResolution": "node",
    "jsx": "preserve",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "suppressImplicitAnyIndexErrors": true,
    "declaration": true,
    "skipLibCheck": true,
    "paths": {
      "@@/*": [".umi/*"]
    }
  },
  "include": [
    "**/src/**/*",
    "**/docs/**/*",
    "scripts/**/*",
    "**/demos",
    ".eslintrc.js",
    "tests",
    "jest.config.js",
    "**/fixtures",
    "./tests/no-duplicated.ts",
    "./typings.d.ts",
    "*.write.js",
    "./config/**/*"
  ]
}
`,
          {
            encoding: 'utf-8',
          },
        );
      });
  },
};

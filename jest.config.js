const { readdirSync } = require('fs');
const { join } = require('path');
// eslint-disable-next-line import/no-dynamic-require
const settings = require(path.join(process.cwd(), 'settings.json'));

const pkgList = readdirSync(join(__dirname, './packages')).filter((pkg) => pkg.charAt(0) !== '.');

const moduleNameMapper = {};

pkgList.forEach((shortName) => {
  const name = `@${settings.scope}/${shortName}`;
  moduleNameMapper[name] = join(__dirname, `./packages/${shortName}/src`);
});

module.exports = {
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!packages/**/src/demos/**',
    '!packages/**/src/**/demos/**',
    '!packages/**/src/components/ColumnSetting/**',
  ],
  moduleNameMapper,
  testURL: 'http://localhost',
  verbose: true,
  snapshotSerializers: [require.resolve('enzyme-to-json/serializer')],
  extraSetupFiles: ['./tests/setupTests.js'],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: false,
  },
};

const moduleNameMapper = {
  '^@ty-one-start/utils$': '<rootDir>/packages/utils/src/index',
  '^@ty-one-start/request$': '<rootDir>/packages/request/src/index',
  '^@ty-one-start/one-start$': '<rootDir>/packages/one-start/src/index',
  '^@ty-one-start/one-proto$': '<rootDir>/packages/one-proto/src/index',
  '^@ty-one-start/scripts$': '<rootDir>/packages/scripts/src/index',
  '^@ty-one-components/frame$': '<rootDir>/packages/frame/src/index',
  '^@ty-one-start/provider$': '<rootDir>/packages/provider/src/index',
};

module.exports = {
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!packages/**/src/demos/**',
    '!packages/**/src/**/demos/**',
  ],
  moduleNameMapper,
  testURL: 'http://localhost',
  verbose: false,
  snapshotSerializers: [require.resolve('enzyme-to-json/serializer')],
  extraSetupFiles: ['./tests/setupTests.js'],
  globals: {},
};

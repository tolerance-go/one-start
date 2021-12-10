module.exports = {
  extraBabelPlugins: [
    'styled-jsx/babel',
    [
      'import',
      {
        libraryName: '@ty/antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
    [
      'import',
      {
        libraryName: 'lodash/fp',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash-fp',
    ],
  ],
};

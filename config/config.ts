import chalk from 'chalk';
import fs from 'fs';
import { join } from 'path';
import { defineConfig } from 'umi';
import type { BaseIConfig } from 'umi';
import appConfigs from '../.configs';
import settings from '../settings.json';

const { scope, siteTitle, services } = settings;
const { extraBabelPlugins } = appConfigs;

const pkgList = fs
  .readdirSync(join(__dirname, '../packages'))
  .filter((pkg) => pkg.charAt(0) !== '.');

const alias = pkgList.reduce((pre, pkg) => {
  return {
    ...pre,
    [`@${scope}/${pkg}`]: join(__dirname, '../packages', pkg, 'src'),
  };
}, {});

const pkgPaths = pkgList
  .map((path) => [join('packages', path, 'src'), join('packages', path, 'src', 'components')])
  .reduce((acc, val) => acc.concat(val), []);

console.log(`🌼 alias list \n${chalk.blue(Object.keys(alias).join('\n'))}`);

console.log(chalk.yellow('调试 dumi 导航的时候，需要临时关闭 mfsu'));

const getOpenapiConfigs = () => {
  return Object.keys(services)
    .map((key) => {
      const config = services[key];

      const getSwaggerJSONPath = () => {
        const localSchemaPath = join(
          process.cwd(),
          'swagger-jsons',
          `${config.name}-services.json`,
        );
        if (fs.existsSync(localSchemaPath)) {
          return localSchemaPath;
        }
        return `http://${config.proxy.host}:${config.swaggerPort}/v3/api-docs`;
      };

      if (config.openapi === false) {
        return false;
      }
      return {
        requestLibPath: settings.requestLibPath,
        schemaPath: getSwaggerJSONPath(),
        serversPath: ['packages', `services-${config.name}`, 'src'],
        projectName: '__services__',
        apiPrefix: `"${config.apiPrefix ?? key}"`,
        namespace: `${config.name[0].toUpperCase()}${config.name.slice(1)}ServiceAPI`,
      };
    })
    .filter(Boolean);
};

const configs = (
  process.env.OPEN_API
    ? defineConfig({
        openAPI: getOpenapiConfigs(),
        plugins: [
          require.resolve(
            join(process.cwd(), 'node_modules/@ty-umijs/plugin-openapi/lib/index.js'),
          ),
        ],
      })
    : defineConfig({
        mode: 'site',
        alias,
        dynamicImport: {},
        extraBabelPlugins,
        resolve: {
          includes: [...pkgPaths, 'docs'],
        },
        title: siteTitle,
        logo: '/logo.svg',
        history: {
          type: 'browser',
        },
        targets: {
          chrome: 80,
          firefox: false,
          safari: false,
          edge: false,
          ios: false,
        },
        externals: {
          xlsx: 'window.XLSX',
          'ag-grid-enterprise': 'window.agGrid',
          'd3-scale': 'd3',
        },
        headScripts: [
          {
            src: '/xlsx.full.min.js',
          },
          {
            src: '/ag-grid-enterprise.min.js',
          },
          { src: '/d3-array.min.js' },
          { src: '/d3-color.min.js' },
          { src: '/d3-format.min.js' },
          { src: '/d3-interpolate.min.js' },
          { src: '/d3-time.min.js' },
          { src: '/d3-time-format.min.js' },
          { src: '/d3-scale.min.js' },
        ],
        webpack5: {},
        // 暂时关闭，该功能在 dumi 中存在性能 bug
        mfsu: {},
        fastRefresh: {},
      })
) as BaseIConfig;

export default configs;

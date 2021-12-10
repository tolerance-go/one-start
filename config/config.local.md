```ts
/* eslint-disable no-console */
import { defineConfig } from 'umi';
import type WebpackChain from 'webpack-chain';
import settings from '../settings.json';

const host = '10.1.6.80'; // 默认的环境，请在提交前保证改回之前的状态
// const host = '10.1.6.13'; // 线上测试环境
// const host = '106.75.239.134'; // 互换内部开发环境
// const host = '172.31.30.243'; // zhuxing 国科
// const host = '172.31.30.87'; // pengshixi 国科
// const host = '10.235.5.53'; // pengshixi 国科
// const host = '10.1.100.78'; // 互换内部测试环境
// const host = '10.1.6.69'; // 互换内部测试环境
// const host = '106.75.210.58';
// const host = '172.31.30.166'; // guoliang
// const host = '10.1.6.69'; // 互换内部开发环境
// const host = '10.1.100.78'; // zhaoyun
// const host = '172.31.30.36'; // sitong

const proxy = {
  '/bct-service': {
    target: `http://${host}`,
    changeOrigin: true,
    pathRewrite: { '^/bct-service': '' },
  },
  '/bct': { target: `http://${host}`, changeOrigin: true },
  '/api': { target: `http://${host}`, changeOrigin: true, pathRewrite: { '^/api': '' } },
  '/swap-service': { target: `http://${host}`, changeOrigin: true },
  '/adapter-service': { target: `http://${host}`, changeOrigin: true },
  '/risk-service': { target: `http://${host}`, changeOrigin: true },
  '/auth-service': { target: `http://${host}`, changeOrigin: true },
  '/trade-service': { target: `http://${host}`, changeOrigin: true },
  '/pricing-service': { target: `http://${host}`, changeOrigin: true },
  '/report-service': { target: `http://${host}`, changeOrigin: true },
  '/market-data-service': { target: `http://${host}`, changeOrigin: true },
  '/quant-service': { target: `http://${host}`, changeOrigin: true },
  '/model-service': { target: `http://${host}`, changeOrigin: true },
  '/exchange-service': { target: `http://${host}`, changeOrigin: true },
  '/margin-service': { target: `http://${host}`, changeOrigin: true },
  '/trade-margin-service': { target: `http://${host}`, changeOrigin: true },
  '/account-service': { target: `http://${host}`, changeOrigin: true },
  '/scenario-service': { target: `http://${host}`, changeOrigin: true },
  '/reference-data-service': { target: `http://${host}`, changeOrigin: true },
  '/user-preference-service': { target: `http://${host}`, changeOrigin: true },
  '/document-service': { target: `http://${host}`, changeOrigin: true },
  '/download-file': { target: `http://${host}`, changeOrigin: true },
  '/workflow-service': { target: `http://${host}`, changeOrigin: true },
  '/airflow-service': { target: `http://${host}`, changeOrigin: true },
  '/attachment-service': { target: `http://${host}`, changeOrigin: true },
  '/license': { target: `http://${host}`, changeOrigin: true },
  '/data-check-service': { target: `http://${host}`, changeOrigin: true },
  '/data-structure-service': { target: `http://${host}`, changeOrigin: true },
  '/capital-service': { target: `http://${host}`, changeOrigin: true },
};

const ServerMaps = settings.services;

console.table(
  Object.keys(ServerMaps).reduce((obj, key) => {
    const config = ServerMaps[key];
    return {
      ...obj,
      [key]: {
        'proxy-target': config.proxy.host,
        description: config.description,
        'swagger-html':
          config.openapi !== false
            ? `http://${config.proxy.host}:${config.swaggerPort}/swagger-ui/index.html`
            : undefined,
      },
    };
  }, {}),
);

const configs = defineConfig({
  proxy,
  chainWebpack: (config: WebpackChain) => {
    config.module
      .rule('svg')
      .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
      .use('url-loader')
      .loader(require.resolve('url-loader'));
  },
}) as Record<string, any>;

export default configs;
```

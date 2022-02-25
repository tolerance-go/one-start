import { defineConfig } from 'umi';
import type { BaseIConfig } from 'umi';

const config = defineConfig({
  esbuild: {},
  hash: true,
  history: {
    type: 'browser',
  },
}) as BaseIConfig;

export default config;

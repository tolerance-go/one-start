import getReadyToPublishPkgs from './scripts/get-ready-to-publish-pkgs';
import getAllPkgs from './scripts/utils/get-all-pkgs';
import settings from './settings.json';
import appConfigs from './.configs';

const { headPkgs } = settings;
const { extraBabelPlugins } = appConfigs;

export default {
  cjs: { type: 'babel', lazy: true },
  esm: {
    type: 'babel',
    importLibToEs: true,
  },
  pkgs:
    process.argv[process.argv.length - 1] === '--all'
      ? getAllPkgs({
          headPkgs,
        })
      : getReadyToPublishPkgs({
          headPkgs,
        }),
  extraBabelPlugins,
};

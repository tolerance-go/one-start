import getReadyToPublishPkgs from './scripts/get-ready-to-publish-pkgs';
import getAllPkgs from './scripts/utils/get-all-pkgs';
import settings from './settings.json';
import appConfigs from './.configs';

const { headPkgs } = settings;
const { extraBabelPlugins } = appConfigs;

const pkgs = (() => {
  if (process.argv[process.argv.length - 2] === '--only' && process.argv[process.argv.length - 1]) {
    return [process.argv[process.argv.length - 1]];
  }

  return process.argv[process.argv.length - 1] === '--all'
    ? getAllPkgs({
        headPkgs,
      })
    : getReadyToPublishPkgs({
        headPkgs,
      });
})();

console.log('🚀 ~ file: .fatherrc.ts ~ line 10 ~ pkgs', pkgs);

export default {
  // cjs: { type: 'babel', lazy: true },
  esm: {
    type: 'babel',
    importLibToEs: true,
  },
  pkgs,
  extraBabelPlugins,
};

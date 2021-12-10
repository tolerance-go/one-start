const path = require('path');
const settings = require(path.join(process.cwd(), 'settings.json'));
const getReadyToPublishPkgs = require('../get-ready-to-publish-pkgs');

console.log(
  getReadyToPublishPkgs({
    headPkgs: settings.headPkgs,
  }),
);

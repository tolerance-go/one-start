const path = require('path');
const settings = require(path.join(process.cwd(), 'settings.json'));
const getAllPkgs = require('../utils/get-all-pkgs');

console.log(
  getAllPkgs({
    headPkgs: [],
  }),
);

const fs = require('fs');
const path = require('path');

const main = (options = {}) => {
  const { headPkgs = [] } = options;
  const pkgs = fs
    .readdirSync(path.join(process.cwd(), 'packages'))
    .filter((item) => item.charAt(0) !== '.');
  const tailPkgs = pkgs.filter((pkg) => pkg.charAt(0) !== '.' && !headPkgs.includes(pkg));
  return [...headPkgs, ...tailPkgs];
};

module.exports = main;

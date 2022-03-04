const fs = require('fs');
const path = require('path');
const settings = require(path.join(process.cwd(), 'settings.json'));

const getImports = (paths, inners = [], relatives = [], tyPkgs = [], external = []) => {
  if (fs.lstatSync(paths).isDirectory()) {
    fs.readdirSync(paths).forEach((item) => {
      getImports(path.join(paths, item), inners, relatives, tyPkgs, external);
    });
  } else {
    if (['.less', '.md', '.txt', '.json'].some((item) => paths.endsWith(item))) {
      return;
    }

    /** 跳过内部 demo 文件 */
    if (paths.indexOf(path.join('src', 'demos')) > -1) {
      return;
    }

    const content = fs.readFileSync(paths, { encoding: 'utf-8' });
    content.replace(new RegExp("from '(.*)';", 'ig'), (_, item) => {
      if (item.startsWith('.')) {
        if (relatives.includes(item)) {
          return;
        }
        relatives.push(item);
      } else {
        if (item.startsWith('@ty') || item.startsWith('ty')) {
          if (item.startsWith(`@${settings.scope}`)) {
            if (inners.includes(item)) {
              return;
            }
            inners.push(item);
            return;
          }
          if (tyPkgs.includes(item)) {
            return;
          }
          tyPkgs.push(item);
          return;
        }
        if (external.includes(item)) {
          return;
        }
        external.push(item);
      }
    });
  }

  return { inners, relatives, tyPkgs, external };
};

module.exports = getImports;

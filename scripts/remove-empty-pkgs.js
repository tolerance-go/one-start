const del = require('del');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const isDirEmpty = (dir) => {
  if (!fs.existsSync(dir)) {
    return true;
  }

  let hasFile = false;
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory() === false) {
      hasFile = true;
      return;
    }
    hasFile = !isDirEmpty(filePath);
  });

  return !hasFile;
};

const run = async () => {
  const prepareRemoves = [];
  // options is optional
  const files = glob.sync('packages/*');

  files.forEach((filePath) => {
    const pkgPath = path.join(process.cwd(), filePath);
    const src = path.join(pkgPath, 'src');
    if (!fs.existsSync(src)) {
      prepareRemoves.push(pkgPath);
      return;
    }
    if (isDirEmpty(src)) {
      prepareRemoves.push(pkgPath);
    }
  });
  const deletedFilePaths = await del(prepareRemoves);

  if (deletedFilePaths.length) {
    console.log('删除的文件:\n', chalk.blue(deletedFilePaths.join('\n')));
  } else {
    console.log(chalk.green('没有可以删除的包'));
  }
};

run();

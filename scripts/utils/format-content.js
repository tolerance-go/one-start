const prettier = require('prettier');

const formatConfigs = prettier.resolveConfig.sync(process.cwd());

const formatContent = (targetPath, content) => {
  const fileInfo = prettier.getFileInfo.sync(targetPath);
  if (fileInfo.ignored || fileInfo.inferredParser == null) {
    return content;
  }

  return formatConfigs
    ? prettier.format(content, {
        ...formatConfigs,
        parser: fileInfo.inferredParser,
      })
    : content;
};

module.exports = formatContent;

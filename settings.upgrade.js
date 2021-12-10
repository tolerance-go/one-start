module.exports = (freshContent /* 远程的文件字符串 */, content /* 当前文件的字符串 */) => {
  const freshConfig = JSON.parse(freshContent);
  const currentConfig = JSON.parse(content);
  return JSON.stringify({
    ...freshConfig,
    ...currentConfig,
  });
};

module.exports = (freshContent /* 远程的文件字符串 */, content /* 当前文件的字符串 */) => {
  const freshConfig = JSON.parse(freshContent);
  const currentConfig = JSON.parse(content);

  const { '@@/*': umi, ...restPaths } =
    (currentConfig.compilerOptions && currentConfig.compilerOptions.paths) || {};

  return JSON.stringify({
    ...freshConfig,
    compilerOptions: {
      ...freshConfig.compilerOptions,
      paths: {
        '@@/*': ['.umi/*'],
        ...restPaths,
      },
    },
  });
};

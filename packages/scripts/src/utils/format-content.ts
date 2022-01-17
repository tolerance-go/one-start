import prettier, { BuiltInParserName, CustomParser } from 'prettier';

const formatConfigs = prettier.resolveConfig.sync(process.cwd());

/**
 * 格式化内容，使用目标文件的格式化配置来转换
 *
 * @param targetPath 文件路径
 * @param content 文件内容
 * @returns
 */
export const formatContent = (targetPath: string, content: string) => {
  const fileInfo = prettier.getFileInfo.sync(targetPath);
  if (fileInfo.ignored || fileInfo.inferredParser == null) {
    return content;
  }

  return formatConfigs
    ? prettier.format(content, {
        ...formatConfigs,
        parser: fileInfo.inferredParser as BuiltInParserName | CustomParser,
      })
    : content;
};

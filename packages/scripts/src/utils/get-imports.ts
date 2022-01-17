import fs from 'fs';
import path from 'path';
import { getSettings } from './get-settings';

/**
 * 获取指定路径下所有文件内容中的依赖
 *
 * @param paths 路径
 * @param inners 内部依赖
 * @param relatives 相对依赖
 * @param tyPkgs ty scope 的依赖
 * @param external 外部依赖
 * @returns
 */
export const getImports = (
  paths: string,
  inners: string[] = [],
  relatives: string[] = [],
  tyPkgs: string[] = [],
  external: string[] = [],
) => {
  const settings = getSettings();

  if (fs.lstatSync(paths).isDirectory()) {
    fs.readdirSync(paths).forEach((item) => {
      getImports(path.join(paths, item), inners, relatives, tyPkgs, external);
    });
  } else {
    if (['.less', '.md', '.txt', '.json'].some((item) => paths.endsWith(item))) {
      return {};
    }
    const content = fs.readFileSync(paths, { encoding: 'utf-8' });
    content.replace(new RegExp("from '(.*)';?", 'ig'), (substring, item: string) => {
      if (item.startsWith('.')) {
        if (relatives.includes(item)) {
          return substring;
        }
        relatives.push(item);
      } else {
        if (item.startsWith('@ty') || item.startsWith('ty')) {
          if (item.startsWith(`@${settings.scope}`)) {
            if (inners.includes(item)) {
              return substring;
            }
            inners.push(item);
            return substring;
          }
          if (tyPkgs.includes(item)) {
            return substring;
          }
          tyPkgs.push(item);
          return substring;
        }
        if (external.includes(item)) {
          return substring;
        }
        external.push(item);
      }
      return substring;
    });
  }

  return { inners, relatives, tyPkgs, external };
};

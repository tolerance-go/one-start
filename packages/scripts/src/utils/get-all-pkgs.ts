import fs from 'fs';
import path from 'path';

/**
 * 获取 packages 下所有包名
 *
 * @param options
 * @param options.headPkgs string[]
 * 指定排在头部的包名称
 *
 * @returns
 */
export const getAllPkgs = (
  options: {
    headPkgs?: string[];
  } = {},
) => {
  const { headPkgs = [] } = options;
  const pkgs = fs
    .readdirSync(path.join(process.cwd(), 'packages'))
    .filter((item) => item.charAt(0) !== '.');
  const tailPkgs = pkgs.filter((pkg) => pkg.charAt(0) !== '.' && !headPkgs.includes(pkg));
  return [...headPkgs, ...tailPkgs];
};

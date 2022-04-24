/** 将参数序列化为数组类型 */
export const normalizeArray = <T extends any>(param?: T | T[]): T[] => {
  if (param == null) {
    return [];
  }
  return Array.isArray(param) ? param : [param];
};

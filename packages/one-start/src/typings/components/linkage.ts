/**
 * 按照数组顺序进行 value 的改变
 */
export type ValueLinkage = (
  changedValues: Record<string, any>,
  values: Record<string, any>,
) => Record<string, any>;

export type ValueAsyncLinkage = (
  changedValues: Record<string, any>,
  values: Record<string, any>,
) => Promise<Record<string, any>>;

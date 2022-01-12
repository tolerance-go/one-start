import { COLUMN_SORDERS_OUTERMOST_KEY } from './constants';

/**
 * 找到树结构中 key 一致的节点，返回结构如下
 * {
 *    item: data[i], // 当前节点
 *    index: i, // 节点所在父级所有子组件下标
 *    items: data, // 节点所在父级所有子组件
 * }
 * @param data
 * @param key
 * @returns
 */
export const findTreeItem = <T extends { children?: any[]; key?: React.Key }>(
  data: T[],
  key: React.Key,
): {
  item: T;
  items: T[];
  index: number;
} | null => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      return {
        item: data[i],
        index: i,
        items: data,
      };
    }
    if (data[i].children) {
      const result = findTreeItem(data[i].children as T[], key);
      if (result) return result;
    }
  }
  return null;
};

export const sortTreeWithOrder = <
  T extends {
    children?: T;
    key: string | number;
  }[],
>(
  treeData: T,
  columnOrders: Record<string, Record<string, number>>,
  pathKey: string[] = [COLUMN_SORDERS_OUTERMOST_KEY],
): T => {
  const orders = columnOrders[pathKey.join('.')];
  if (orders) {
    const next = treeData.sort((l, r) => orders[l.key] ?? 0 - orders[r.key] ?? 0);

    return next.map((item) =>
      item.children
        ? {
            ...item,
            children: sortTreeWithOrder(
              item.children,
              columnOrders,
              pathKey.concat(item.key.toString()),
            ),
          }
        : item,
    ) as T;
  }
  return treeData;
};

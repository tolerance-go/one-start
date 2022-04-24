import utl from 'lodash';
import type { ColumnOrdersItemMetaType, ColumnOrdersMetaType } from '@ty-one-start/typings';

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

const parseOrder = (orderMeta?: ColumnOrdersItemMetaType | number): ColumnOrdersItemMetaType => {
  if (orderMeta == null) {
    return {
      order: -1,
    };
  }
  return typeof orderMeta === 'number'
    ? {
        order: orderMeta,
      }
    : orderMeta;
};

export const sortTreeWithOrder = <
  T extends {
    children?: T;
    key: string | number;
  }[],
>(
  treeData: T,
  columnOrders?: ColumnOrdersMetaType,
): T => {
  if (columnOrders == null || Object.keys(columnOrders).length === 0) {
    return treeData;
  }
  const orders = utl.mapValues(columnOrders, (val) => {
    if (typeof val === 'number') {
      return val;
    }
    return val.order;
  });
  if (!utl.isEmpty(orders)) {
    const next = [...treeData].sort((l, r) => (orders[l.key] ?? -1) - (orders[r.key] ?? -1));

    return next.map((item) =>
      item.children
        ? {
            ...item,
            children: sortTreeWithOrder(
              item.children,
              parseOrder(columnOrders[item.key.toString()]).children,
            ),
          }
        : item,
    ) as T;
  }
  return treeData;
};

export const findTreeNodeMeta = <
  T extends {
    [key: string]: any;
    children?: T;
  }[],
>(
  items: T,
  callback: (item: T[number]) => boolean,
  parent?: T[number],
): {
  parent?: T[number];
  item: T[number];
  itemIndex?: number;
} | null => {
  let findItem: T[number] | null = null;
  let itemIndex: number | undefined;
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    if (item.children) {
      const result = findTreeNodeMeta(item.children, callback, item);
      if (result) {
        return result;
      }
    }

    if (callback(item)) {
      findItem = item;
      itemIndex = index;
      break;
    }
  }

  return findItem ? { parent, item: findItem, itemIndex } : null;
};

/** 如果 callback 返回值不是 T 元素类型，需要手动强制转换 */
export const mapTreeNode = <
  T extends {
    [key: string]: any;
    children?: T;
  }[],
  B = T[number],
>(
  items: T,
  callback: (item: T[number], parent?: T[number], paths?: T[number][]) => B,
  parent?: T[number],
  parents: T[number][] = [],
): (B & {
  [key: string]: any;
  children?: B[];
})[] => {
  const nextItems = [...items];
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < nextItems.length; index++) {
    let item = nextItems[index];
    if (item.children) {
      // eslint-disable-next-line no-param-reassign
      nextItems[index] = {
        ...nextItems[index],
        children: mapTreeNode(item.children, callback, item, [...parents, item]),
      };
      item = nextItems[index];
    }

    const newItem = callback(item, parent, parents);
    // eslint-disable-next-line no-param-reassign
    nextItems[index] = newItem;
  }

  return nextItems as B[];
};

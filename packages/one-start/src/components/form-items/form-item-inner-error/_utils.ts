/** 找到最近的父级元素 */
export const findClosestParentElement = (
  target: HTMLElement | undefined,
  predicate: (current: HTMLElement) => boolean,
): HTMLElement | undefined => {
  if (target == null) return undefined;

  if (predicate(target) === true) {
    return target;
  }

  if (target.parentElement) {
    return findClosestParentElement(target.parentElement, predicate);
  }

  return undefined;
};

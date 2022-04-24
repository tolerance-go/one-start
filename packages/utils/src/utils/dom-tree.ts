export const findParent = (
  dom: Element | null | undefined,
  cb: (dom: Element) => boolean,
): Element | undefined => {
  if (dom == null) return undefined;

  if (cb(dom)) {
    return dom;
  }
  return findParent(dom.parentElement, cb);
};

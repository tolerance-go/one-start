export const getPromiseMeta = () => {
  let resolve: (() => void) | undefined;
  let reject: (() => void) | undefined;
  return {
    resolve,
    reject,
    promise: new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    }),
  };
};

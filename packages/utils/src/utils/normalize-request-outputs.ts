import type { RequestOutputs } from '@ty-one-start/typings';

export const normalizeRequestOutputs = <T extends any>(
  data: RequestOutputs<T> | boolean | void,
) => {
  if (typeof data === 'boolean') {
    return {
      error: data,
    };
  }
  if (data == null) {
    return {
      error: false,
    };
  }
  return data;
};

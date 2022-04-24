import type { OSTableChangeValueType, OSTableValueType } from '@ty-one-start/typings';

export const parseTableValue = (value: OSTableChangeValueType): OSTableValueType => {
  if (Array.isArray(value)) {
    return value;
  }
  return value?.target;
};

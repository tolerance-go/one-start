import type { OSTableChangeValueType, OSTableValueType } from '../../typings';

export const parseTableValue = (value: OSTableChangeValueType): OSTableValueType => {
  if (Array.isArray(value)) {
    return value;
  }
  return value?.target;
};

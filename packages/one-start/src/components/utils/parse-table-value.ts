import { OSTableChangeValueType } from '../typings';

export const parseTableValue = (value: OSTableChangeValueType) => {
  if (Array.isArray(value)) {
    return value;
  }
  return value?.target;
};

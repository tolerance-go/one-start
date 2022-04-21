import utl from 'lodash';
import type { OSRadioOptionItem, OSSelectOptionItem } from '../@ty-one-start/typings';

export const convertEnumsToOptions = (
  valueEnums_?: Record<string, string | undefined>,
): (OSSelectOptionItem | OSRadioOptionItem)[] => {
  return utl.toPairs(valueEnums_).map(([value, label]) => ({
    key: value,
    label,
    value,
  }));
};

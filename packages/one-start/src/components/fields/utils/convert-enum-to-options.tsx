import utl from 'lodash';
import type { OSRadioOptionItem, OSSelectOptionItem } from '../../typings';

export const convertEnumsToOptions = (
  valueEnums_?: Record<string, string>,
): (OSSelectOptionItem | OSRadioOptionItem)[] => {
  return utl.toPairs(valueEnums_).map(([value, label]) => ({
    label,
    value,
  }));
};

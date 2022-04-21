import utl from 'lodash';
import type { OSTableValueType } from '../@ty-one-start/typings';
import { parseTableValue } from '../../utils/parse-table-value';

export const convertTableDataSourceToFormValues = (rowKey: string, value?: OSTableValueType) => {
  return utl.mapValues(
    utl.groupBy(parseTableValue(value), (item) => item[rowKey]),
    (val) => val[0],
  );
};

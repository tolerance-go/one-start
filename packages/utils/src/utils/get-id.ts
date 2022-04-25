import { normalizeDataIndex } from './normalize-data-index';
import type { NamePath } from 'antd/lib/form/interface';

export const getNamePathId = (
  namePath: NamePath | null | undefined | readonly (string | number)[],
  split: string,
) => {
  return normalizeDataIndex(namePath).join(split);
};

export const getKeyIndexId = (
  dataIndex: number | string | readonly (string | number)[] | undefined | null,
  split: string = '-',
) => {
  return getNamePathId(dataIndex, split);
};

export const getDataIndexId = (
  dataIndex: number | string | readonly (string | number)[] | undefined | null,
  split: string = '.',
) => {
  return getNamePathId(dataIndex, split);
};

/** 当前搜索参数的快照 */

import { useRef } from 'react';
import { RecordType } from '../typings';

export type SnapshotOfCurrentSearchParametersType = {
  current?: number | undefined;
  pageSize?: number | undefined;
  search: RecordType;
};

export const useSnapshotOfCurrentSearchParameters = () => {
  const snapshotOfCurrentSearchParametersRef = useRef<SnapshotOfCurrentSearchParametersType>({
    search: {},
  });

  return {
    snapshotOfCurrentSearchParametersRef,
  };
};

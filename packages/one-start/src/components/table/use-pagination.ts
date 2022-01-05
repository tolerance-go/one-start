import type { PaginationProps } from '@ty/antd/es/pagination';
import { useMemo } from 'react';
import type { OSTableType } from '../../typings';

export const usePagination = ({
  pagination,
  current,
  totalCount,
  enableGridTree,
}: {
  pagination?: Required<OSTableType>['settings']['pagination'];
  current?: number;
  totalCount?: number;
  enableGridTree?: boolean;
}) => {
  const normalizedPagination = useMemo(() => {
    if (enableGridTree) {
      return false;
    }
    if (pagination !== false) {
      return {
        defaultPageSize: pagination?.defaultPageSize ?? 20,
        current,
        total: totalCount,
        showTotal: (all, range) => `第 ${range[0]}-${range[1]} 条/总共 ${all} ${'条'}`,
        showSizeChanger: pagination?.showSizeChanger ?? true,
        simple: pagination?.simple,
        hideOnSinglePage: pagination?.hideOnSinglePage,
      } as PaginationProps;
    }
    return pagination;
  }, [current, enableGridTree, pagination, totalCount]);

  return normalizedPagination;
};

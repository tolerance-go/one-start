import type { PaginationProps } from 'antd/es/pagination';
import { useMemo } from 'react';
import type { OSTableType } from '@ty-one-start/typings';

export const usePagination = ({
  pagination,
  current,
  totalCount,
}: {
  pagination?: Required<OSTableType>['settings']['pagination'];
  current?: number;
  totalCount?: number;
}) => {
  const normalizedPagination = useMemo(() => {
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
  }, [current, pagination, totalCount]);

  return normalizedPagination;
};

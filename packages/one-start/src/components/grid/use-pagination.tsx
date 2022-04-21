import type { PaginationProps } from '@ty/antd';
import { Pagination } from '@ty/antd';
import { useMemo } from 'react';
import type { RequestDataSourceActions } from './typings';
import type { OSGridType } from '@ty-one-start/typings';

export const usePagination = ({
  pagination,
  current,
  totalCount,
  requestDataSourceActionsRef,
}: {
  pagination?: Required<OSGridType>['settings']['pagination'];
  current?: number;
  totalCount?: number;
  requestDataSourceActionsRef?: React.MutableRefObject<RequestDataSourceActions>;
}) => {
  const normalizedPagination = useMemo(() => {
    if (pagination === false) {
      return {
        defaultPageSize: 20,
      };
    }
    return {
      defaultPageSize: pagination?.defaultPageSize ?? 20,
      current,
      total: totalCount,
      showTotal: (all, range) => `第 ${range[0]}-${range[1]} 条/总共 ${all} ${'条'}`,
      showSizeChanger: pagination?.showSizeChanger ?? true,
      simple: pagination?.simple,
      hideOnSinglePage: pagination?.hideOnSinglePage,
    } as PaginationProps;
  }, [current, pagination, totalCount]);

  const dom = useMemo(() => {
    if (pagination === false) {
      return null;
    }
    return (
      <Pagination
        size="small"
        {...normalizedPagination}
        showSizeChanger
        showQuickJumper
        onChange={async (current_: number, pageSize?: number) => {
          requestDataSourceActionsRef?.current?.requestDataSource({
            current: current_ ?? 1,
            pageSize: pageSize ?? normalizedPagination?.defaultPageSize ?? 20,
          });
        }}
        onShowSizeChange={() => {}}
      />
    );
  }, [normalizedPagination, pagination, requestDataSourceActionsRef]);

  return { dom, pagination: normalizedPagination };
};

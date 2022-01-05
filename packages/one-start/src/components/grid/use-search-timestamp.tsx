import { Typography } from '@ty/antd';
import { useState, useMemo } from 'react';
import type { RequiredRecursion } from '../../typings';
import type { OSTableType, OSGridAPI } from '../../typings';

export const useSearchTimestamp = ({
  pagination,
  enableSearch,
  loading,
  tableActionsRef,
}: {
  pagination?: RequiredRecursion<OSTableType>['settings']['pagination'];
  loading?: boolean;
  enableSearch?: boolean;
  tableActionsRef: React.MutableRefObject<OSGridAPI>;
}) => {
  const [timeStr, setTimeStr] = useState<string>();
  const dom = useMemo(() => {
    if (loading) return null;
    if (enableSearch) {
      const text = (
        <Typography.Text
          type="secondary"
          style={{
            fontSize: 13,
          }}
        >
          最近搜索时间: {timeStr ?? '--'}
        </Typography.Text>
      );

      if (pagination !== false) {
        if (pagination?.hideOnSinglePage) {
          const data =
            tableActionsRef.current.getVisualDataSource() ??
            tableActionsRef.current.getDataSource();
          if (data && data.length <= (pagination.defaultPageSize ?? 20)) {
            return text;
          }
        }
        return text;
      }
    }
    return null;
  }, [enableSearch, loading, pagination, tableActionsRef, timeStr]);

  return {
    dom,
    setTimeStr,
  };
};

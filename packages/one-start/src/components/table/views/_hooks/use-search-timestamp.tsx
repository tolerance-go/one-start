import { useMemo, useState } from 'react';
import type { OSTableAPI, OSTableType, RequiredRecursion } from '../../../../typings';

export const useSearchTimestamp = ({
  pagination,
  enableSearch,
  loading,
  loopRequest,
  tableActionsRef,
}: {
  loopRequest?: number;
  pagination?: RequiredRecursion<OSTableType>['settings']['pagination'];
  loading?: boolean;
  enableSearch?: boolean;
  tableActionsRef: React.MutableRefObject<OSTableAPI>;
}) => {
  // const [timeStr, setTimeStr] = useState<string>();
  const [, setTimeStr] = useState<string>();
  const dom = useMemo(() => {
    if (loading) return null;
    if (enableSearch || loopRequest != null) {
      const text =
        // <Typography.Text
        //   type="secondary"
        //   style={{
        //     fontSize: 13,
        //   }}
        // >
        //   最近搜索时间: {timeStr ?? '--'}
        // </Typography.Text>
        null;

      if (pagination !== false) {
        if (pagination?.hideOnSinglePage) {
          const data =
            tableActionsRef.current.getVisualDataSource() ??
            tableActionsRef.current.getDataSource();
          if (data && data.length <= (pagination.defaultPageSize ?? 20)) {
            return <div style={{ marginTop: 5 }}>{text}</div>;
          }
        }
        return (
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 5,
            }}
          >
            {text}
          </div>
        );
      }

      return <div style={{ marginTop: 5 }}>{text}</div>;
    }
    return null;
  }, [enableSearch, loading, pagination, tableActionsRef, loopRequest]);

  return {
    dom,
    setTimeStr,
  };
};

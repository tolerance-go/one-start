import { MinusSquareOutlined } from '@ant-design/icons';
import type { OSTableValueType } from '@ty-one-start/typings';
import { Button } from '@ty/antd';
import { useMemo, useState } from 'react';
import type { TreeSpreadActions } from '../../typings';
import { useActionsRef } from '@ty-one-start/utils';

// const flat = <
//   T extends {
//     children?: T[];
//     [key: string]: any;
//   },
// >(
//   items: T[],
// ): T[] => {
//   return items.reduce((arr, next) => {
//     return arr.concat(next.children ? [next, ...flat(next.children)] : next);
//   }, [] as T[]);
// };

// const getRecordId = (record: Record<string, any>) => {
//   return record[rowKey];
// };

export const useTreeSpread = ({
  dataSource,
  ref,
}: {
  dataSource: OSTableValueType;
  ref: React.RefObject<TreeSpreadActions>;
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);

  const enableTree = useMemo(() => {
    return dataSource?.some((item) => item.children);
  }, [dataSource]);

  const expandBtn = useMemo(() => {
    if (enableTree) {
      return (
        <Button
          disabled={!expandedRowKeys.length}
          onClick={() => {
            setExpandedRowKeys([]);
          }}
          type="text"
        >
          <MinusSquareOutlined
            style={{
              marginRight: 5,
            }}
          />
          <span>收起全部</span>
        </Button>
      );
    }
    return null;
  }, [expandedRowKeys, enableTree]);

  const clearExpandedRowKeys = () => {
    if (expandedRowKeys.length) {
      setExpandedRowKeys([]);
    }
  };

  useActionsRef(
    {
      clearExpandedRowKeys,
    },
    ref,
  );

  return {
    expandBtn,
    expandedRowKeys,
    setExpandedRowKeys,
  };
};

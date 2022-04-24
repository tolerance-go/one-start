import type { TableProps } from '@ty/antd';
import type React from 'react';
import { useMemo } from 'react';
import type { OSTableType, RecordType, RequiredRecursion } from '@ty-one-start/typings';

export const useAntdRowSelectionConfigs = ({
  bulkOperationViewDom,
  selectedRowKeys,
  selections,
  rowSelection,
  setSelectedRows,
  setSelectedRowKeys,
}: {
  selections?: RequiredRecursion<TableProps<RecordType>>['rowSelection']['selections'];
  rowSelection?: RequiredRecursion<OSTableType>['settings']['rowSelection'];
  bulkOperationViewDom: React.ReactNode;
  selectedRowKeys?: React.Key[];
  setSelectedRows: React.Dispatch<React.SetStateAction<RecordType[]>>;
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
}) => {
  const configs = useMemo((): TableProps<RecordType>['rowSelection'] => {
    return bulkOperationViewDom
      ? {
          type: 'checkbox',
          onChange: (selectedRowKeys_: React.Key[], selectedRows_: RecordType[]) => {
            setSelectedRowKeys(selectedRowKeys_);
            setSelectedRows(selectedRows_);
          },
          selectedRowKeys,
          checkStrictly: rowSelection?.checkStrictly,
          selections,
        }
      : undefined;
  }, [
    rowSelection?.checkStrictly,
    selectedRowKeys,
    bulkOperationViewDom,
    setSelectedRowKeys,
    setSelectedRows,
    selections,
  ]);

  return { configs };
};

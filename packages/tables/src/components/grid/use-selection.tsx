import { Space, Typography } from 'antd';
import utl from 'lodash';
import React, { useMemo, useState } from 'react';
import { useActionsRef } from '@ty-one-start/utils';
import type { OSGridAPI, OSGridType, RecordType, TableCoreAPI } from '@ty-one-start/typings';
import type { RequiredRecursion } from '@ty-one-start/typings';
import type { SelectionsActions } from './typings';

export const useSelection = ({
  batchOperation,
  extraBatchOperation,
  tableActionsRef,
  tableCoreActionsRef,
  rowKey,
  ref,
}: {
  batchOperation?: RequiredRecursion<OSGridType>['settings']['batchOperation'];
  extraBatchOperation?: OSGridType['extraBatchOperation'];
  tableActionsRef: React.MutableRefObject<OSGridAPI>;
  tableCoreActionsRef: React.MutableRefObject<TableCoreAPI>;
  rowKey: string;
  ref: React.MutableRefObject<Partial<SelectionsActions> | null>;
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<RecordType[]>([]);

  const selectedRowsMaps = useMemo(() => {
    return selectedRows.reduce((maps, next) => {
      return {
        ...maps,
        [next[rowKey]]: next,
      };
    }, {});
  }, [rowKey, selectedRows]);

  // eslint-disable-next-line no-param-reassign
  tableCoreActionsRef.current.removeSelectedRowKeysAndRow = (cb) => {
    const removeKeys = cb(selectedRowKeys, selectedRows);
    if (removeKeys.length === 0) return;
    const leftKeys = utl.difference(selectedRowKeys, removeKeys);
    const leftRows = utl.differenceWith(selectedRows, removeKeys, (row, key) => {
      return row[rowKey] === key;
    });
    setSelectedRowKeys(leftKeys);
    setSelectedRows(leftRows);
  };

  const operationDom = React.Children.map(
    [
      ...(extraBatchOperation?.({
        selectedRowKeys,
        selectedRows,
        actions: tableActionsRef.current,
      }) ?? []),
      ...(batchOperation?.({
        selectedRowKeys,
        selectedRows,
        actions: tableActionsRef.current,
      }) ?? []),
    ],
    (item) => {
      if (React.isValidElement(item)) {
        return React.cloneElement(item, {
          ...item.props,
          __disabled: selectedRowKeys.length === 0,
        });
      }
      return item;
    },
  );

  const dom = (
    <Space size={5}>
      {
        <Typography.Text strong style={{ fontSize: 14, marginRight: 5 }}>
          已选择 {selectedRowKeys.length} 项
        </Typography.Text>
      }
      {operationDom}
    </Space>
  );

  useActionsRef(
    {
      getSelectedRowKeys: () => selectedRowKeys,
      getSelectedRows: () => selectedRows,
      setSelectedRows,
      setSelectedRowKeys,
    },
    ref,
  );

  return {
    dom: React.Children.count(operationDom) === 0 ? null : dom,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedRows,
    setSelectedRows,
    selectedRowsMaps,
  };
};

/**
 * 批量操作视图
 */
import { Space, Typography } from '@ty/antd';
import React from 'react';
import type { OSTableAPI, OSTableType, RecordType, RequiredRecursion } from '../../../typings';

export const BulkOperationView = ({
  selectedRowKeys = [],
  selectedRows = [],
  batchOperation,
  extraBatchOperation,
  tableAPISRef,
}: {
  selectedRows?: RecordType[];
  selectedRowKeys?: React.Key[];
  batchOperation?: RequiredRecursion<OSTableType>['settings']['batchOperation'];
  extraBatchOperation?: OSTableType['extraBatchOperation'];
  tableAPISRef: React.MutableRefObject<OSTableAPI>;
}) => {
  const operationDom = React.Children.map(
    [
      ...(extraBatchOperation?.({
        selectedRowKeys,
        selectedRows,
        actions: tableAPISRef.current,
      }) ?? []),
      ...(batchOperation?.({
        selectedRowKeys,
        selectedRows,
        actions: tableAPISRef.current,
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

  return (
    <Space size={5}>
      {
        <Typography.Text
          className="bulk-operation-counter"
          strong
          style={{ fontSize: 14, marginRight: 5 }}
        >
          已选择 {selectedRowKeys.length} 项
        </Typography.Text>
      }
      {React.Children.count(operationDom) === 0 ? null : operationDom}
    </Space>
  );
};

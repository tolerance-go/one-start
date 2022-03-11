/**
 * 批量操作视图
 */
import { Space, Typography } from '@ty/antd';
import React from 'react';

export const BulkOperationView = ({
  selectedRowKeys = [],
  operationDom,
}: {
  operationDom?: React.ReactNode;
  selectedRowKeys?: React.Key[];
}) => {
  if (React.Children.count(operationDom) === 0) {
    return null;
  }

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
      {operationDom}
    </Space>
  );
};

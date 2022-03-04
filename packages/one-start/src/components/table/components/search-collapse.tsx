import { Row, Typography } from '@ty/antd';
import React from 'react';

export const SearchCollapse = ({
  value,
  onChange,
}: {
  onChange?: (collapse: boolean) => void;
  value?: boolean;
}) => {
  return (
    <Row justify="start">
      <Typography.Link
        onClick={() => {
          onChange?.(!value);
        }}
      >
        {value ? '收起更多' : '展开更多'}
      </Typography.Link>
    </Row>
  );
};

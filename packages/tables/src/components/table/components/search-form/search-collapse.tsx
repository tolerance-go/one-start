import { Row, Typography } from 'antd';
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
        className="collapse-link"
        onClick={() => {
          onChange?.(!value);
        }}
      >
        {value ? '收起更多' : '展开更多'}
      </Typography.Link>
    </Row>
  );
};

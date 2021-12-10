import { Empty } from '@ty/antd';
import React from 'react';

const OSEmpty: React.FC<{
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)', ...props.style }}
    />
  );
};

export default OSEmpty;

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from '@ty/antd';
import React, { useState } from 'react';

export const useRenderTooltip = ({ title }: { title?: string }) => {
  const [hover, setHover] = useState(false);

  return (
    <Tooltip title={title}>
      <QuestionCircleOutlined
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        style={{
          cursor: 'help',
          fontSize: '12px',
          lineHeight: '12px',
          verticalAlign: 'middle',
          color: hover ? undefined : 'rgba(0, 0, 0, 0.45)',
        }}
      />
    </Tooltip>
  );
};

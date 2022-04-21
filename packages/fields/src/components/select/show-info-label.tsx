import { Col, Typography } from '@ty/antd';
import ResizeObserver from 'rc-resize-observer';
import React, { useState } from 'react';

export const ShowInfoLabel: React.FC<{
  hoverTitle?: string;
}> = (props) => {
  const [width, setWidth] = useState<number>();

  return (
    <ResizeObserver
      onResize={({ width: _width }) => {
        setWidth(_width);
      }}
    >
      <Col flex="auto" title={props.hoverTitle}>
        <Typography.Text
          style={{
            width,
          }}
          ellipsis
        >
          {props.children}
        </Typography.Text>
      </Col>
    </ResizeObserver>
  );
};

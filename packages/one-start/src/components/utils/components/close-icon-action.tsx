import { CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

export default (props: { onClick?: () => void; style?: React.CSSProperties }) => {
  const [active, setActive] = useState(false);

  return (
    <CloseOutlined
      style={{
        cursor: 'pointer',
        color: active ? '#000' : '#888',
        fontSize: 12,
        ...props.style,
      }}
      onMouseOver={() => {
        if (!active) {
          setActive(true);
        }
      }}
      onMouseLeave={() => {
        setActive(false);
      }}
      onClick={props.onClick}
    />
  );
};

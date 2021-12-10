import type { TooltipProps } from '@ty/antd';
import { Tooltip } from '@ty/antd';
import React, { useState } from 'react';

const ActionTooltip = (
  props: TooltipProps & {
    isCloseAfterClick?: boolean;
  },
) => {
  const [visible, setVisible] = useState(false);

  return (
    <Tooltip {...props} visible={visible}>
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => {
          if (props.isCloseAfterClick) {
            setVisible(false);
          }
        }}
      >
        {props.children}
      </span>
    </Tooltip>
  );
};

export default ActionTooltip;

import { QuestionCircleOutlined } from '@ant-design/icons';
import type { TooltipProps } from 'antd';
import { Tooltip } from 'antd';
import React, { useState, useImperativeHandle } from 'react';

export type OSTooltipAPI = {
  setVisible: (visible: boolean) => void;
};

const OSTooltip_: React.ForwardRefRenderFunction<
  OSTooltipAPI,
  React.PropsWithChildren<TooltipProps>
> = (props, ref) => {
  const [visible, setVisible] = useState(false);
  useImperativeHandle(ref, () => ({
    setVisible,
  }));

  return <Tooltip visible={visible} onVisibleChange={setVisible} {...props} />;
};

const OSTooltip = React.forwardRef(OSTooltip_);

export const renderTooltip = (
  tooltip?: string | string[],
  style?: React.CSSProperties,
  ref?: React.MutableRefObject<OSTooltipAPI | null>,
) => {
  return tooltip ? (
    <OSTooltip
      ref={ref}
      title={
        <div>
          {(Array.isArray(tooltip) ? tooltip : [tooltip]).map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      }
    >
      <QuestionCircleOutlined style={style} />
    </OSTooltip>
  ) : null;
};

import React from 'react';
import type { OSFormItemInputHistoryData } from '@ty-one-start/typings';

export const OSFormItemInput: React.ForwardRefRenderFunction<
  {},
  {
    title?: React.ReactNode;
    historyData?: OSFormItemInputHistoryData[];
  }
> = (props) => {
  const { children, historyData, title, ...restProps } = props;

  if (React.isValidElement(children)) {
    if (historyData?.length) {
      return (
        <div>
          <div style={{ color: '#00000073' }}>
            {React.cloneElement(children, {
              ...restProps,
              onChange: undefined,
              mode: 'read',
              value: historyData[historyData.length - 1].current,
            })}
          </div>
          <div>{React.cloneElement(children, restProps)}</div>
        </div>
      );
    }
    return React.cloneElement(children, restProps);
  }
  return <>{children}</>;
};

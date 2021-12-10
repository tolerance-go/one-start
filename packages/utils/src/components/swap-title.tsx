import React from 'react';

interface SwapTitleProps {
  children: any;
}

const SwapTitle = (props: SwapTitleProps) => {
  return (
    <div style={{ margin: '0 0 10px 0', fontSize: 15, fontWeight: 700 }}>{props.children}</div>
  );
};

export { SwapTitle };
export type { SwapTitleProps };

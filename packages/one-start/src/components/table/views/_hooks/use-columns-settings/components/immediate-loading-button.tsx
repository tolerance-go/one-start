import type { ButtonProps } from '@ty/antd';
import { Button } from '@ty/antd';
import React, { useState, useEffect } from 'react';

export const ImmediateLoadingButton: React.ForwardRefRenderFunction<
  {},
  Omit<ButtonProps, 'onClick'> & {
    onClick: () => void;
  }
> = (props) => {
  const [loading, setLoading] = useState(false);
  const { onClick, ...restProps } = props;

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        props?.onClick();
        setLoading(false);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <Button
      {...restProps}
      block
      style={{
        borderRadius: 0,
      }}
      loading={loading}
      onClick={() => {
        setLoading(true);
      }}
    />
  );
};

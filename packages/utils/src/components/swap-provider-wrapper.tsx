import React, { useContext } from 'react';
import ProProvider from '@ty-ant-design/pro-provider';
import type { ProRenderFieldPropsType } from '@ty-ant-design/pro-provider';
import { customValueType } from './value-type';

const SwapProviderWrapper: React.FC<{ valueTypeMap?: Record<string, ProRenderFieldPropsType> }> = (
  props,
) => {
  const values = useContext(ProProvider);
  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: Object.assign(customValueType, props?.valueTypeMap),
      }}
    >
      {props.children}
    </ProProvider.Provider>
  );
};

export { SwapProviderWrapper };

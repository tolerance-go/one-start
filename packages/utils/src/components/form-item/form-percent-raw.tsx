import createField from '@ty-ant-design/pro-form/es/BaseForm/createField';
import React from 'react';
import ProField from '@ty-ant-design/pro-field';
import type { InputNumberProps } from '@ty/antd';
import type { ProFormItemProps } from '@ty-ant-design/pro-form/es/interface';

type PercentRawProps = ProFormItemProps<InputNumberProps> & {
  min?: InputNumberProps['min'];
  max?: InputNumberProps['max'];
};
/**
 * 百分比表单组件
 *
 * @param
 */
const PercentRaw: React.ForwardRefRenderFunction<any, PercentRawProps> = (
  { fieldProps, min, proFieldProps, max },
  ref,
) => {
  return (
    <ProField
      mode="edit"
      valueType={'percent-raw' as any}
      fieldProps={{
        min,
        max,
        ...fieldProps,
      }}
      ref={ref}
      {...proFieldProps}
    />
  );
};

export default createField<PercentRawProps>(
  React.forwardRef(PercentRaw),
) as React.ForwardRefRenderFunction<any, PercentRawProps>;

export type { PercentRawProps };

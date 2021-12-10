import { Input, InputProps } from '@ty/antd';
import React from 'react';
import { OSTextFieldAPI, OSTextFieldType } from '../typings';

const OSTextField: React.ForwardRefRenderFunction<OSTextFieldAPI, OSTextFieldType> = (
  props,
  ref,
) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;

  const { bordered, autoFocus, disabled, placeholder } = settings ?? {};

  if (mode === 'read') {
    const dom = (
      <span ref={ref as React.MutableRefObject<HTMLSpanElement>}>{text ?? _value ?? '--'}</span>
    );
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: InputProps['onChange'] = (value) => {
      onChangeHook?.(value.target.value);
      return _onChange?.(value);
    };

    return (
      <Input
        allowClear
        disabled={disabled}
        bordered={bordered}
        autoFocus={autoFocus}
        ref={ref as React.MutableRefObject<Input>}
        value={_value}
        onChange={onChange}
        placeholder={placeholder ?? '请输入文本'}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSTextField);
export const Settings: React.FC<OSTextFieldType['settings']> = () => <></>;

import { Input } from '@ty/antd';
import type { TextAreaProps } from '@ty/antd/lib/input';
import React from 'react';
import type { OSTextareaFieldType, OSTextareaFieldAPI } from '../../typings';

const OSTextareaField: React.ForwardRefRenderFunction<OSTextareaFieldAPI, OSTextareaFieldType> = (
  props,
  ref,
) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;

  const { bordered, autoFocus, disabled, placeholder, showCount, maxLength } = settings ?? {};

  if (mode === 'read') {
    const dom = (
      <span ref={ref as React.MutableRefObject<HTMLSpanElement>}>{text ?? _value ?? '--'}</span>
    );
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: TextAreaProps['onChange'] = (value) => {
      onChangeHook?.(value.target.value);
      return _onChange?.(value);
    };

    return (
      <Input.TextArea
        showCount={showCount}
        maxLength={maxLength}
        allowClear
        disabled={disabled}
        bordered={bordered}
        autoFocus={autoFocus}
        ref={ref as React.MutableRefObject<HTMLTextAreaElement>}
        value={_value}
        onChange={onChange}
        placeholder={placeholder ?? '请输入文本'}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSTextareaField);
export const Settings: React.FC<OSTextareaFieldType['settings']> = () => <></>;

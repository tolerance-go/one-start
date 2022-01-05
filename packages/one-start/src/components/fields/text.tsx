import type { InputProps } from '@ty/antd';
import { Input } from '@ty/antd';
import React from 'react';
import type { OSTextFieldAPI, OSTextFieldType } from '../../typings';
import Highlighter from 'react-highlight-words';

const OSTextField: React.ForwardRefRenderFunction<OSTextFieldAPI, OSTextFieldType> = (
  props,
  ref,
) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;

  const { bordered, autoFocus, disabled, placeholder, searchValue } = settings ?? {};

  if (mode === 'read') {
    const render = () => {
      const val = text ?? _value;
      if (val != null) {
        if (searchValue != null && searchValue !== val) {
          return (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={searchValue == null ? [] : [searchValue]}
              autoEscape
              textToHighlight={val}
            />
          );
        }
        return val;
      }
      return '--';
    };

    const dom = <span ref={ref as React.MutableRefObject<HTMLSpanElement>}>{render()}</span>;
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

import type { InputProps } from '@ty/antd';
import { Image, Input } from '@ty/antd';
import React from 'react';
import type { OSImageFieldAPI, OSImageFieldType, OSImageFieldValueType } from '@ty-one-start/typings';
import { useClsPrefix } from '../utils/use-cls-prefix';

const OSImageField: React.ForwardRefRenderFunction<OSImageFieldAPI, OSImageFieldType> = (
  props,
  ref,
) => {
  const {
    text,
    onValueChange,
    settings,
    mode = 'read',
    value: _value,
    onChange: _onChange,
  } = props;

  const clsPrefix = useClsPrefix('os-field-image');
  const { bordered, autoFocus, disabled, width, height, fallback } = settings ?? {};

  const parseVal = (val: OSImageFieldValueType): string => {
    if (val instanceof Blob) {
      const imageBlob = val;
      if (window.webkitURL) {
        return window.webkitURL.createObjectURL(imageBlob);
      }
      if (window.URL && window.URL.createObjectURL) {
        return window.URL.createObjectURL(imageBlob);
      }
    }
    return val as string;
  };

  if (mode === 'read') {
    return (
      <Image
        preview={{
          className: `${clsPrefix}-preview`,
        }}
        className={clsPrefix}
        style={{ background: '#fff' }}
        width={width}
        height={height}
        fallback={fallback}
        src={parseVal(text ?? _value)}
      />
    );
  }

  if (mode === 'edit' || mode === 'update') {
    const onChange: InputProps['onChange'] = (value) => {
      onValueChange?.(value.target.value);
      return _onChange?.(value);
    };

    return (
      <Input
        className={clsPrefix}
        allowClear
        disabled={disabled}
        bordered={bordered}
        autoFocus={autoFocus}
        ref={ref as React.MutableRefObject<Input>}
        value={parseVal(_value)}
        onChange={onChange}
        placeholder="请输入文本"
      />
    );
  }

  return null;
};

export default React.forwardRef(OSImageField);

export const Settings: React.FC<OSImageFieldType['settings']> = () => <></>;

import type { InputNumberProps } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import type {
  OSDigitFieldBaseAPI,
  OSRelativeDayFieldAPI,
  OSRelativeDayFieldType,
} from '@ty-one-start/typings';
import DigitBase from './digit-base';

const OSRelativeDayField: React.ForwardRefRenderFunction<
  OSRelativeDayFieldAPI,
  OSRelativeDayFieldType
> = (props, ref) => {
  const {
    text,
    onValueChange,
    settings,
    mode = 'read',
    value: _value,
    onChange: _onChange,
  } = props;

  const { bordered, autoFocus, min = -5, max = 5 } = settings ?? {};

  const focusRef = useRef(false);
  const [precision, setPrecision] = useState<number>();

  const inputNumberRef = useRef<OSDigitFieldBaseAPI>(null);

  useImperativeHandle(ref, () => {
    return inputNumberRef.current!;
  });

  if (mode === 'read') {
    return (
      <DigitBase
        mode="read"
        settings={{
          bordered,
          autoFocus,
          min,
          max,
        }}
        formatter={(value) => {
          if (Number(value) === 0) {
            return 'T';
          }
          return `T${value != null && value > 0 ? '+' : ''}${value ?? ''}`;
        }}
        ref={inputNumberRef}
        value={_value}
        text={text}
        onChange={_onChange}
        {...{
          onValueChange,
        }}
      />
    );
  }
  if (mode === 'edit' || mode === 'update') {
    const formatter: InputNumberProps['formatter'] = (value) => {
      if (value === '' || value == null || focusRef.current) {
        return value ? value.toString() : '';
      }
      if (Number(value) === 0) {
        return 'T';
      }
      return `T${value != null && value > 0 ? '+' : ''}${value ?? ''}`;
    };
    const parser: InputNumberProps['parser'] = (value) => {
      return value?.replace(/^T[-+]?/, '') ?? '';
    };

    const handleFocus = () => {
      focusRef.current = true;

      // https://github.com/react-component/input-number/blob/7440f52f3305632eda5fc20e1302ddacc7ec50ac/src/InputNumber.tsx#L473
      setPrecision(0);
    };
    const handleBlur = () => {
      focusRef.current = false;
      setPrecision(undefined);
    };

    return (
      <DigitBase
        mode={mode}
        settings={{
          bordered,
          autoFocus,
          min,
          max,
          precision,
        }}
        formatter={formatter}
        parser={parser}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputNumberRef}
        value={_value}
        text={text}
        onChange={_onChange}
        {...{
          onValueChange,
        }}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSRelativeDayField);

export const Settings: React.FC<OSRelativeDayFieldType['settings']> = () => <></>;

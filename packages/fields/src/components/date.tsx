import type { DatePickerProps } from '@ty/antd';
import { DatePicker } from '@ty/antd';
import type { PickerProps } from '@ty/antd/lib/date-picker/generatePicker';
import type { Moment } from 'moment';
import moment from 'moment';
import type { Component } from 'react';
import React, { useImperativeHandle, useRef, useState } from 'react';
import type { OSDateFieldAPI, OSDateFieldType, OSDateFieldValueType } from '@ty-one-start/typings';
import { useClsPrefix } from '../utils/use-cls-prefix';

const OSDateField: React.ForwardRefRenderFunction<OSDateFieldAPI, OSDateFieldType> = (
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

  const clsPrefix = useClsPrefix('os-date-field');
  const {
    bordered,
    autoFocus,
    format = 'YYYY-MM-DD',
    placeholder,
    disabledDate,
    disabled,
    id,
    showNow,
    showTime,
  } = settings ?? {};
  const [open, setOpen] = useState<boolean>();

  const inlineRef = useRef<OSDateFieldAPI>(null);

  const parseValue = (val?: OSDateFieldValueType) => {
    if (val == null) {
      return val;
    }
    if (typeof val === 'string') {
      return moment(val, format);
    }
    return val;
  };

  useImperativeHandle(ref, () => {
    return {
      ...inlineRef.current!,
      open: () => {
        setOpen(true);
      },
    } as OSDateFieldAPI;
  });

  if (mode === 'read') {
    const formatValue = (val?: OSDateFieldValueType) => {
      if (val == null) {
        return '--';
      }
      return parseValue(val)?.format(format);
    };
    const dom = (
      <span id={id} ref={inlineRef as React.MutableRefObject<HTMLSpanElement>}>
        {formatValue(text ?? _value)}
      </span>
    );
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: DatePickerProps['onChange'] = (value) => {
      onValueChange?.(value);
      return _onChange?.(value);
    };

    return (
      <DatePicker
        id={id}
        showNow={showNow}
        showTime={showTime}
        open={open}
        disabled={disabled}
        disabledDate={disabledDate}
        onOpenChange={setOpen}
        className={clsPrefix}
        bordered={bordered}
        autoFocus={autoFocus}
        ref={inlineRef as React.RefObject<Component<PickerProps<Moment>, any, any>>}
        value={parseValue(_value)}
        onChange={onChange}
        format={format}
        placeholder={placeholder ?? '请选择日期'}
        style={{
          width: '100%',
          minWidth: 120,
        }}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSDateField);
export const Settings: React.FC<OSDateFieldType['settings']> = () => <></>;

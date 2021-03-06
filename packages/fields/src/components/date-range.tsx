import { SwapRightOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import type { RangePickerDateProps } from 'antd/es/date-picker/generatePicker';
import type { RangePickerProps } from 'antd/lib/date-picker/generatePicker';
import type { Moment } from 'moment';
import moment from 'moment';
import type { Component } from 'react';
import React, { useImperativeHandle, useRef, useState } from 'react';
import type {
  OSDateRangeFieldAPI,
  OSDateRangeFieldType,
  OSDateRangeFieldValueType,
} from '@ty-one-start/typings';
import { useClsPrefix } from '@ty-one-start/utils';

const OSDateRangeField: React.ForwardRefRenderFunction<OSDateRangeFieldAPI, OSDateRangeFieldType> =
  (props, ref) => {
    const {
      text,
      onValueChange,
      settings,
      mode = 'read',
      value: _value,
      onChange: _onChange,
    } = props;

    const clsPrefix = useClsPrefix('os-date-range-field');
    const { showTime } = settings ?? {};
    const {
      bordered,
      autoFocus,
      format = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
      disabledDate,
      allowClear = true,
    } = settings ?? {};
    const inlineRef = useRef<OSDateRangeFieldAPI>(null);
    const [open, setOpen] = useState<boolean>();

    const parseValueItem = (valueItem?: Moment | string | null) => {
      if (valueItem == null) {
        return null;
      }
      if (typeof valueItem === 'string') {
        return moment(valueItem, format);
      }
      return valueItem;
    };

    const parseValue = (val?: OSDateRangeFieldValueType) => {
      if (Array.isArray(val)) {
        return [parseValueItem(val[0]), parseValueItem(val[1])] as [Moment | null, Moment | null];
      }
      return undefined;
    };

    useImperativeHandle(ref, () => {
      return {
        ...inlineRef.current!,
        open: () => {
          setOpen(true);
        },
      } as OSDateRangeFieldAPI;
    });

    if (mode === 'read') {
      const formatValue = (val?: OSDateRangeFieldValueType) => {
        if (val == null) {
          return '--';
        }
        const parsed = parseValue(val);
        if (Array.isArray(parsed)) {
          return (
            <span>
              {parsed[0]?.format(format) ?? '--'}
              <SwapRightOutlined style={{ paddingLeft: 5, paddingRight: 5 }} />
              {parsed[0]?.format(format) ?? '--'}
            </span>
          );
        }
        return val;
      };

      const dom = (
        <span ref={inlineRef as React.MutableRefObject<HTMLSpanElement>}>
          {formatValue(text ?? _value)}
        </span>
      );
      return dom;
    }
    if (mode === 'edit' || mode === 'update') {
      const onChange: RangePickerProps<Moment>['onChange'] = (value) => {
        onValueChange?.(value);
        return _onChange?.(value);
      };

      return (
        <DatePicker.RangePicker
          allowClear={allowClear}
          showTime={showTime as RangePickerDateProps<Moment>['showTime']}
          open={open}
          onOpenChange={setOpen}
          className={clsPrefix}
          bordered={bordered}
          autoFocus={autoFocus}
          ref={inlineRef as React.RefObject<Component<RangePickerProps<Moment>, any, any>>}
          value={parseValue(_value)}
          onChange={onChange}
          format={format}
          style={{
            width: '100%',
            minWidth: 120,
          }}
          disabledDate={disabledDate}
        />
      );
    }
    return null;
  };

export default React.forwardRef(OSDateRangeField);
export const Settings: React.FC<OSDateRangeFieldType['settings']> = () => <></>;

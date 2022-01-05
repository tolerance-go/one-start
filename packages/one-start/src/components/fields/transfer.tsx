import { Transfer } from '@ty/antd';
import React from 'react';
import type {
  OSTransferFieldAPI,
  OSTransferFieldType,
  OSTransferFieldValueType,
} from '../../typings';
import utl from 'lodash';

const OSTransferField: React.ForwardRefRenderFunction<OSTransferFieldAPI, OSTransferFieldType> = (
  props,
  ref,
) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;

  const { source } = settings ?? {};

  if (mode === 'read') {
    const sourceMap = utl.fromPairs(source?.map((item) => [item.key, item.title]));
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>}>
        {(text ?? _value)?.map((key) => sourceMap[key])?.join(', ')}
      </span>
    );
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange = (value: OSTransferFieldValueType) => {
      onChangeHook?.(value);
      return _onChange?.(value);
    };

    return (
      <Transfer
        ref={
          ref as React.RefObject<
            Transfer<{
              key?: string | undefined;
              title: string;
              children?: OSTransferFieldValueType | undefined;
            }>
          >
        }
        targetKeys={_value}
        dataSource={source}
        render={(item) => item.title}
        onChange={onChange}
      ></Transfer>
    );
  }
  return null;
};

export default React.forwardRef(OSTransferField);
export const Settings: React.FC<OSTransferFieldType['settings']> = () => <></>;

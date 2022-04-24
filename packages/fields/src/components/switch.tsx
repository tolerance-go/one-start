import type { SwitchProps } from '@ty/antd';
import { Switch } from '@ty/antd';
import React from 'react';
import type { OSSwitchFieldAPI, OSSwitchFieldType } from '@ty-one-start/typings';
import { useClsPrefix } from '@ty-one-start/utils';
import classNames from 'classnames';

const OSSwitchField: React.ForwardRefRenderFunction<OSSwitchFieldAPI, OSSwitchFieldType> = (
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
  const { autoFocus, className } = settings ?? {};

  if (mode === 'read') {
    const zhMap = {
      true: '是',
      false: '否',
    };
    const val = text ?? _value;
    const dom = (
      <span className={className} ref={ref as React.MutableRefObject<HTMLSpanElement>}>
        {val != null ? zhMap[String(val)] : '--'}
      </span>
    );
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: SwitchProps['onChange'] = (value) => {
      onValueChange?.(value);
      return _onChange?.(value);
    };

    return (
      <Switch
        className={classNames(clsPrefix, className)}
        autoFocus={autoFocus}
        ref={ref as React.RefObject<HTMLInputElement>}
        checked={_value}
        onChange={onChange}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSSwitchField);
export const Settings: React.FC<OSSwitchFieldType['settings']> = () => <></>;

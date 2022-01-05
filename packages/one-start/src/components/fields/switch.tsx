import type { SwitchProps } from '@ty/antd';
import { Switch } from '@ty/antd';
import React from 'react';
import type { OSSwitchFieldAPI, OSSwitchFieldType } from '../../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';

const OSSwitchField: React.ForwardRefRenderFunction<OSSwitchFieldAPI, OSSwitchFieldType> = (
  props,
  ref,
) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;

  const clsPrefix = useClsPrefix('os-date-field');
  const { autoFocus } = settings ?? {};

  if (mode === 'read') {
    const zhMap = {
      true: '是',
      false: '否',
    };
    const val = text ?? _value;
    const dom = (
      <span ref={ref as React.MutableRefObject<HTMLSpanElement>}>
        {val != null ? zhMap[String(val)] : '--'}
      </span>
    );
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: SwitchProps['onChange'] = (value) => {
      onChangeHook?.(value);
      return _onChange?.(value);
    };

    return (
      <Switch
        className={clsPrefix}
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

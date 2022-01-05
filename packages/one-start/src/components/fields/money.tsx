import React, { useMemo, useCallback } from 'react';
import type { OSDigitFieldBaseType, OSMoneyFieldAPI, OSMoneyFieldType } from '../../typings';
import { formatter, parser } from '../utils/format';
import DigitBase from './digit-base';

const OSMoneyField: React.ForwardRefRenderFunction<OSMoneyFieldAPI, OSMoneyFieldType> = (
  props,
  ref,
) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;

  const {
    bordered,
    autoFocus,
    format = '0,0.[0000000]',
    unit = 'CNY',
    stringMode,
    min,
    max,
    disabled,
    unitInValue,
  } = settings ?? {};

  const normalUnit = useMemo(() => {
    if (unitInValue) {
      if (typeof _value === 'object') {
        return _value?.unit;
      }
    }
    return unit;
  }, [_value, unit, unitInValue]);

  const normalVal = useMemo(() => {
    if (typeof _value === 'object') {
      return _value?.value;
    }
    return _value;
  }, [_value]);

  const normalText = useMemo(() => {
    if (typeof text === 'object') {
      return text?.value;
    }
    return text;
  }, [text]);

  const handleChange: OSDigitFieldBaseType['onChange'] = useCallback(
    (value) => {
      if (unitInValue) {
        _onChange?.({
          value,
          unit: normalUnit,
        });
        return;
      }
      _onChange?.(value);
    },
    [_onChange, normalUnit, unitInValue],
  );

  const handleChangeHook: OSDigitFieldBaseType['onChangeHook'] = useCallback(
    (value) => {
      if (unitInValue) {
        onChangeHook?.({
          value,
          unit: normalUnit,
        });
        return;
      }
      onChangeHook?.(value);
    },
    [normalUnit, onChangeHook, unitInValue],
  );

  if (mode === 'read') {
    return (
      <DigitBase
        mode="read"
        settings={{
          format,
          addon: normalUnit,
          addonPlacement: 'before',
          stringMode,
          bordered,
          autoFocus,
          min,
          max,
          disabled,
        }}
        ref={ref}
        value={normalVal}
        text={normalText}
        onChange={handleChange}
        onChangeHook={handleChangeHook}
      />
    );
  }
  if (mode === 'edit' || mode === 'update') {
    return (
      <DigitBase
        mode={mode}
        settings={{
          format,
          addon: normalUnit,
          addonPlacement: 'before',
          stringMode,
          bordered,
          autoFocus,
          min,
          max,
          disabled,
        }}
        text={normalText}
        formatter={formatter}
        parser={parser}
        ref={ref}
        value={normalVal}
        onChange={handleChange}
        onChangeHook={handleChangeHook}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSMoneyField);

export const Settings: React.FC<OSMoneyFieldType['settings']> = () => <></>;

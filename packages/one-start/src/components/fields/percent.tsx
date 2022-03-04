import BigNumber from 'bignumber.js';
import React, { useCallback } from 'react';
import type { OSDigitFieldBaseType, OSPercentFieldAPI, OSPercentFieldType } from '../../typings';
import { DEFAULT_DECIMAL_DATA } from '../constants/digit';
import DigitBase from './digit-base';

const OSPercentField: React.ForwardRefRenderFunction<OSPercentFieldAPI, OSPercentFieldType> = (
  props,
  ref,
) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;

  const {
    bordered,
    autoFocus,
    format = '0.[000000]',
    decimalData = DEFAULT_DECIMAL_DATA,
    stringMode,
    min,
    max,
    disabled,
  } = settings ?? {};

  const unit = '%';

  const count = useCallback(
    (instance: BigNumber) => {
      if (stringMode) {
        return instance.toString();
      }
      return instance.toNumber();
    },
    [stringMode],
  );

  const parseValue = useCallback(
    (value) =>
      value == null || value === '' ? value : count(new BigNumber(value).multipliedBy(100)),
    [count],
  );

  const transformValue = useCallback(
    (value) => {
      return value == null || value === '' ? value : count(new BigNumber(value).dividedBy(100));
    },
    [count],
  );

  const getExtra = (): Partial<OSDigitFieldBaseType> => {
    if (decimalData) {
      return {
        transformValue,
        parseValue,
      };
    }
    return {};
  };

  const parseExtremum = (num?: number | string) => {
    if (num == null) return num;
    const temp = new BigNumber(num);
    /** antd inputnumber 的 min 和 max 是基于显示层面的 */
    return count(decimalData ? temp.multipliedBy(100) : temp);
  };

  if (mode === 'read') {
    return (
      <DigitBase
        mode="read"
        settings={{
          format,
          addonPlacement: 'after',
          addon: unit,
          stringMode,
          bordered,
          autoFocus,
          min: parseExtremum(min),
          max: parseExtremum(max),
          disabled,
        }}
        ref={ref}
        value={_value}
        text={text}
        onChange={_onChange}
        {...getExtra()}
        {...{
          onChangeHook,
        }}
      />
    );
  }
  if (mode === 'edit' || mode === 'update') {
    return (
      <DigitBase
        mode={mode}
        settings={{
          format,
          addonPlacement: 'after',
          addon: unit,
          stringMode,
          bordered,
          autoFocus,
          min: parseExtremum(min),
          max: parseExtremum(max),
          disabled,
        }}
        ref={ref}
        value={_value}
        text={text}
        onChange={_onChange}
        {...getExtra()}
        {...{
          onChangeHook,
        }}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSPercentField);

export const Settings: React.FC<OSPercentFieldType['settings']> = () => <></>;

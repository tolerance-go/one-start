import React, { useImperativeHandle, useRef } from 'react';
import type { OSDigitFieldAPI, OSDigitFieldBaseAPI, OSDigitFieldType } from '../../typings';
import DigitBase from './digit-base';

const OSDigitField: React.ForwardRefRenderFunction<OSDigitFieldAPI, OSDigitFieldType> = (
  props,
  ref,
) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;

  const {
    bordered,
    disabled,
    autoFocus,
    format = '0,0.[0000000]',
    stringMode,
    min,
    max,
    precision,
    addon,
    addonPlacement,
    addonFlexWidth,
    step,
    id,
  } = settings ?? {};

  const inputNumberRef = useRef<OSDigitFieldBaseAPI>(null);

  useImperativeHandle(ref, () => {
    return inputNumberRef.current!;
  });

  if (mode === 'read') {
    return (
      <DigitBase
        ref={inputNumberRef}
        mode="read"
        settings={{
          format,
          stringMode,
          bordered,
          autoFocus,
          min,
          max,
          disabled,
          precision,
          addon,
          addonPlacement,
          addonFlexWidth,
          step,
          id,
        }}
        value={_value}
        text={text}
        onChange={_onChange}
        {...{
          onChangeHook,
        }}
      />
    );
  }
  if (mode === 'edit' || mode === 'update') {
    return (
      <DigitBase
        ref={inputNumberRef}
        mode={mode}
        settings={{
          format,
          stringMode,
          bordered,
          autoFocus,
          min,
          max,
          disabled,
          precision,
          addon,
          addonPlacement,
          addonFlexWidth,
          step,
          id,
        }}
        value={_value}
        text={text}
        onChange={_onChange}
        {...{
          onChangeHook,
        }}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSDigitField);

export const Settings: React.FC<OSDigitFieldType['settings']> = () => <></>;

import type { ProFieldPropsType } from '@ty-ant-design/pro-field';
import ProField from '@ty-ant-design/pro-field';
import BigNumber from 'bignumber.js';
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import type { FieldDigitProps } from '@ty-ant-design/pro-field/es/components/Digit';

type FieldPercentRawProps = FieldDigitProps;

const FieldPercentRaw: React.ForwardRefRenderFunction<
  any,
  ProFieldPropsType & FieldPercentRawProps
> = (props, ref) => {
  const inputNumberRef = useRef();

  const convertValue = useCallback((value: number | undefined) => {
    if (value == null || value === undefined) {
      return value;
    }
    return new BigNumber(value).multipliedBy(100).toNumber();
  }, []);

  const value = useMemo(() => {
    return convertValue(props.fieldProps?.value);
  }, [props.fieldProps?.value]);

  const text = useMemo(() => {
    return convertValue(props.text);
  }, [props.text]);

  const convertChangedValue = useCallback((changedVal: number | undefined) => {
    if (changedVal == null || changedVal === undefined) {
      return changedVal;
    }
    return new BigNumber(changedVal).dividedBy(100).toNumber();
  }, []);

  const onFieldPropsChange = useCallback(
    (nextVal: number | undefined) => {
      props.fieldProps?.onChange(convertChangedValue(nextVal));
    },
    [props.fieldProps?.onChange],
  );

  const onChange = useCallback(
    (nextVal: number | undefined) => {
      props.onChange?.(convertChangedValue(nextVal));
    },
    [props.onChange],
  );

  useImperativeHandle(ref, () => inputNumberRef.current);

  return (
    <ProField
      {...props}
      text={text}
      onChange={onChange}
      valueType={{
        type: 'percent',
        showSymbol: true,
        hideSymbolOnPositive: true,
        precision: 4,
      }}
      fieldProps={{
        ...props.fieldProps,
        value,
        onChange: onFieldPropsChange,
      }}
      ref={inputNumberRef}
    />
  );
};

export default React.forwardRef(FieldPercentRaw);

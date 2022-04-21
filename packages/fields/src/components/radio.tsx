import type { RadioProps } from '@ty/antd';
import { Radio } from '@ty/antd';
import React, { useMemo } from 'react';
import type { OSRadioFieldAPI, OSRadioFieldType, OSRadioOptionItem } from '@ty-one-start/typings';
import { convertEnumsToOptions } from './_utils/convert-enum-to-options';
import utl from 'lodash';

const OSRadioField: React.ForwardRefRenderFunction<OSRadioFieldAPI, OSRadioFieldType> = (
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

  const { disabled, options, valueEnums } = settings ?? {};

  const normalizeOptions = useMemo(() => {
    if (options) {
      return options;
    }
    return valueEnums ? convertEnumsToOptions(valueEnums) : undefined;
  }, [valueEnums, options]);

  if (mode === 'read') {
    const normalizeValueEnums = utl.fromPairs(
      utl.map(normalizeOptions, (item) => [item.value, item.label]),
    );

    const val = text ?? _value;
    const dom = (
      <span ref={ref as React.MutableRefObject<HTMLSpanElement>}>
        {normalizeValueEnums[val ?? ''] ?? val ?? '--'}
      </span>
    );
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: RadioProps['onChange'] = (value) => {
      onValueChange?.(value.target.value);
      return _onChange?.(value);
    };

    return (
      <Radio.Group
        disabled={disabled}
        ref={ref as React.MutableRefObject<HTMLDivElement>}
        value={_value}
        onChange={onChange}
        options={normalizeOptions as OSRadioOptionItem[]}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSRadioField);
export const Settings: React.FC<OSRadioFieldType['settings']> = () => <></>;

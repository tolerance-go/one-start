import { InputNumber, Space } from '@ty/antd';
import React, { useImperativeHandle, useRef } from 'react';
import type { OSTimeLagFieldAPI, OSTimeLagFieldType } from '../typings';

const OSTimeLagField: React.ForwardRefRenderFunction<OSTimeLagFieldAPI, OSTimeLagFieldType> = (
  props,
  ref,
) => {
  const { value = [], onChange, settings } = props;

  const { addonBefore, addonAfter } = settings ?? {};

  const dayRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    dayRef: dayRef.current!,
    hoursRef: hoursRef.current!,
    minuteRef: minuteRef.current!,
  }));

  const handleChange = (val: number, index: number) => {
    const result = [...value];
    result[index] = val;
    onChange?.(result);
  };
  return (
    <Space>
      {addonBefore}
      <InputNumber
        ref={dayRef}
        style={{ width: 80 }}
        value={value[0]}
        onChange={(e) => handleChange(e, 0)}
        min={0}
      />
      日
      <InputNumber
        ref={hoursRef}
        style={{ width: 80 }}
        value={value[1]}
        onChange={(e) => handleChange(e, 1)}
        min={0}
        max={23}
      />
      时
      <InputNumber
        ref={minuteRef}
        style={{ width: 80 }}
        value={value[2]}
        onChange={(e) => handleChange(e, 2)}
        min={0}
        max={59}
      />
      分{addonAfter}
    </Space>
  );
};

export default React.forwardRef(OSTimeLagField);

export const Settings: React.FC<OSTimeLagFieldType['settings']> = () => <></>;

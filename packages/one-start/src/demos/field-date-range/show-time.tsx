/**
 * desc: 自测存在 bug https://github.com/ant-design/ant-design/issues/32134
 */
import type { OSDateRangeFieldInputAPI, OSDateRangeFieldValueType } from '@ty-one-start/one-start';
import { OSDateRangeField, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useRef, useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSDateRangeFieldValueType>();
  const ref = useRef<OSDateRangeFieldInputAPI>(null);

  return (
    <OSProviderWrapper>
      <OSDateRangeField
        ref={ref}
        value={value}
        onChange={setValue}
        mode="edit"
        settings={{
          showTime: true,
        }}
      ></OSDateRangeField>
    </OSProviderWrapper>
  );
};

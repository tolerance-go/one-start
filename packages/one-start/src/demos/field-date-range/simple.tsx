import type { OSDateRangeFieldValueType } from '@ty-one-start/one-start';
import { OSDateRangeField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSDateRangeFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSDateRangeField value={value} onChange={setValue} mode="edit"></OSDateRangeField>
        <OSDateRangeField value={value} mode="read"></OSDateRangeField>
      </Space>
    </OSProviderWrapper>
  );
};

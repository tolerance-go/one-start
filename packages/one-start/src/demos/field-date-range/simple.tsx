import type { OSDateRangeFieldValueType } from '@ty-one-start/one-start';
import { OSDateRangeField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSDateRangeFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSDateRangeField
          value={value}
          onChange={setValue}
          mode="edit"
          settings={{
            allowClear: false,
          }}
        ></OSDateRangeField>
        <OSDateRangeField value={value} mode="read"></OSDateRangeField>
      </Space>
    </OSProviderWrapper>
  );
};

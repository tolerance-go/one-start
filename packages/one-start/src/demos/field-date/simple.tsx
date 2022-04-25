import { OSDateField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string | number>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSDateField
          value={value}
          onChange={setValue}
          mode="edit"
          settings={{
            allowClear: false,
          }}
        ></OSDateField>
        <OSDateField value={value} mode="read"></OSDateField>
      </Space>
    </OSProviderWrapper>
  );
};

import { OSTextareaField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSTextareaField
          value={value}
          onChange={(e) => setValue(e?.target.value)}
          mode="edit"
        ></OSTextareaField>
        <OSTextareaField value={value} mode="read"></OSTextareaField>
      </Space>
    </OSProviderWrapper>
  );
};

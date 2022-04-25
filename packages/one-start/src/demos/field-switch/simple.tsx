import { OSSwitchField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<boolean>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSSwitchField value={value} onChange={setValue} mode="edit"></OSSwitchField>
        <OSSwitchField value={value} mode="read"></OSSwitchField>
      </Space>
    </OSProviderWrapper>
  );
};

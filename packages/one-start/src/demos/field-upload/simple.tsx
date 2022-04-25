import type { OSUploadFieldValueType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSUploadField } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSUploadFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSUploadField value={value} onChange={setValue} mode="edit"></OSUploadField>
        <OSUploadField value={value} mode="read"></OSUploadField>
      </Space>
    </OSProviderWrapper>
  );
};

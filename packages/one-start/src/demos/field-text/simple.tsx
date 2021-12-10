import { OSTextField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSTextField
          value={value}
          onChange={(e) => setValue(e?.target.value)}
          mode="edit"
        ></OSTextField>
        <OSTextField value={value} mode="read"></OSTextField>
      </Space>
    </OSProviderWrapper>
  );
};

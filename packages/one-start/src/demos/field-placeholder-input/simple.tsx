import { OSPlaceholderInputField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Divider, Space } from '@ty/antd';
import { mock, Random } from 'mockjs';
import React, { useState } from 'react';

const placeholders = mock({
  'list|20': [
    {
      label: () => Random.word(),
      value() {
        return this.label;
      },
    },
  ],
}).list;

export default () => {
  const [value, setValue] = useState<string>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSPlaceholderInputField
          value={value}
          onChange={setValue}
          mode="edit"
          settings={{
            placeholders,
          }}
        ></OSPlaceholderInputField>
        <OSPlaceholderInputField value={value} mode="read"></OSPlaceholderInputField>
      </Space>
      <Divider />
      <OSPlaceholderInputField
        value={value}
        onChange={setValue}
        mode="edit"
        settings={{
          placeholders,
        }}
      ></OSPlaceholderInputField>
    </OSProviderWrapper>
  );
};

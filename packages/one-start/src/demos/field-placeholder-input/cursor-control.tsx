import { OSPlaceholderInputField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useState } from 'react';

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
            placeholders: [
              {
                label: 'label1',
                value: 'label1',
              },
              {
                label: 'label2',
                value: 'label2',
              },
              {
                label: 'label3',
                value: 'label3',
              },
            ],
          }}
        ></OSPlaceholderInputField>
        <OSPlaceholderInputField value={value} mode="read"></OSPlaceholderInputField>
      </Space>
    </OSProviderWrapper>
  );
};

import type { OSTreeSelectFieldValueType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSTreeSelectField } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSTreeSelectFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSTreeSelectField
          mode="edit"
          value={value}
          onChange={setValue}
          settings={{
            treeOptions: [
              {
                value: 'p',
                label: 'P',
                children: [
                  { value: 'a', label: 'A' },
                  { value: 'b', label: 'B' },
                  { value: 'c', label: 'C' },
                ],
              },
            ],
          }}
        ></OSTreeSelectField>
        <OSTreeSelectField
          mode="read"
          value={value}
          onChange={setValue}
          settings={{
            treeOptions: [
              {
                value: 'p',
                label: 'P',
                children: [
                  { value: 'a', label: 'A' },
                  { value: 'b', label: 'B' },
                  { value: 'c', label: 'C' },
                ],
              },
            ],
          }}
        ></OSTreeSelectField>
      </Space>
    </OSProviderWrapper>
  );
};

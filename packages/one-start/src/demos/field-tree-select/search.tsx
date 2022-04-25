import type { OSTreeSelectFieldValueType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSTreeSelectField } from '@ty-one-start/one-start';
import { Space } from 'antd';
import delay from 'delay';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSTreeSelectFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space split={'|'}>
        <OSTreeSelectField
          mode="edit"
          value={value}
          onChange={setValue}
          settings={{
            multiple: true,
            showSearch: true,
          }}
          requests={{
            requestOptions: async ({ searchValue }) => {
              await delay(1000);
              return {
                error: false,
                data: [
                  {
                    value: 'p',
                    label: 's-P',
                    children: [
                      { value: 'a', label: 's-A' },
                      { value: 'b', label: 's-B' },
                      { value: 'c', label: 's-C' },
                    ].filter((item) => (searchValue ? item.label.indexOf(searchValue) > -1 : true)),
                  },
                ],
              };
            },
          }}
        ></OSTreeSelectField>
        <OSTreeSelectField
          mode="edit"
          value={value}
          onChange={setValue}
          settings={{
            multiple: true,
            showSearch: 'local',
          }}
          requests={{
            requestOptions: async () => {
              await delay(1000);
              return {
                error: false,
                data: [
                  {
                    value: 'p',
                    label: 's-P',
                    children: [
                      { value: 'a', label: 's-A' },
                      { value: 'b', label: 's-B' },
                      { value: 'c', label: 's-C' },
                    ],
                  },
                ],
              };
            },
          }}
        ></OSTreeSelectField>
      </Space>
    </OSProviderWrapper>
  );
};

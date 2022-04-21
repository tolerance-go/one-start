import type { OSTreeSelectFieldValueType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSTreeSelectField } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import delay from 'delay';
import React, { useState } from 'react';
import type { OSSelectFieldLabelValueType } from '@ty-one-start/typings';

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
            labelInValue: true,
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
                      { value: 'a', label: 's-A', data: { name: 'data-a' } },
                      { value: 'b', label: 's-B', data: { name: 'data-b' } },
                      { value: 'c', label: 's-C', data: { name: 'data-c' } },
                    ].filter((item) => (searchValue ? item.label.indexOf(searchValue) > -1 : true)),
                  },
                ],
              };
            },
          }}
        ></OSTreeSelectField>
        {JSON.stringify(value as OSSelectFieldLabelValueType)}
      </Space>
    </OSProviderWrapper>
  );
};

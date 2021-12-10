import type { OSSelectFieldValueType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import { mock } from 'mockjs';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSSelectFieldValueType>();
  return (
    <OSProviderWrapper>
      <Space>
        <OSSelectField
          mode="edit"
          value={value}
          onChange={(next) => {
            console.log(next);
            setValue(next);
          }}
          settings={{
            mode: 'multiple',
            labelInValue: true,
          }}
          requests={{
            requestOptions: async () => {
              return mock({
                error: false,
                'data|20': [
                  {
                    data: {
                      name: '@word',
                    },
                    label: '@word',
                    value: '@word',
                  },
                ],
              });
            },
          }}
        />
        <OSSelectField
          mode="edit"
          value={value}
          onChange={(next) => {
            console.log(next);
            setValue(next);
          }}
          settings={{
            mode: 'multiple',
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
            labelInValue: true,
          }}
        />
        <OSSelectField
          text={['a', 'b']}
          mode="read"
          value={value}
          settings={{
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
            labelInValue: true,
          }}
        ></OSSelectField>
      </Space>
    </OSProviderWrapper>
  );
};

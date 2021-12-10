import type { OSSelectFieldValueType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import { mock, Random } from 'mockjs';
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
            showInfo: [
              {
                dataIndex: 'name',
                title: '姓名',
                valueType: 'text',
              },
              {
                dataIndex: 'value',
                title: '年纪',
                valueType: 'digit',
              },
            ],
          }}
          requests={{
            requestOptions: async () => {
              return mock({
                error: false,
                'data|20': [
                  {
                    data: {
                      name: '@word',
                      value: Random.integer(),
                    },
                    label: '@word',
                    value: '@word',
                  },
                ],
              });
            },
          }}
        />
      </Space>
    </OSProviderWrapper>
  );
};

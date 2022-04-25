import { OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import { Space } from 'antd';
import delay from 'delay';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSSelectField
          mode="edit"
          settings={{
            mode: 'multiple',
          }}
          requests={{
            requestOptions: async () => {
              await delay(1000);
              return mock({
                error: false,
                'data|1-100': [
                  {
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
          settings={{
            mode: 'multiple',
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
          }}
        />
        <OSSelectField
          text={['a', 'b']}
          mode="read"
          settings={{
            mode: 'multiple',
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
          }}
        ></OSSelectField>
      </Space>
    </OSProviderWrapper>
  );
};

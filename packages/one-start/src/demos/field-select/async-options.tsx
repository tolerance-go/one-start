import { OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import { Space } from 'antd';
import delay from 'delay';
import { mock, Random } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSSelectField
          mode="edit"
          requests={{
            requestOptions: async () => {
              await delay(1000);
              return mock({
                error: false,
                'data|1-100': [
                  {
                    label: () => Random.word(5, 20),
                    value: () => Random.word(5, 20),
                  },
                ],
              });
            },
          }}
        ></OSSelectField>
      </Space>
    </OSProviderWrapper>
  );
};

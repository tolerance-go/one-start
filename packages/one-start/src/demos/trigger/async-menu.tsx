import { OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import delay from 'delay';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮3',
          }}
          requests={{
            requestMenuData: async () => {
              await delay(5000);
              return mock({
                error: false,
                'data|1-10': [
                  {
                    text: '@word',
                  },
                ],
              });
            },
          }}
        ></OSTrigger>

        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮4',
            split: true,
          }}
          requests={{
            requestMenuData: async () => {
              await delay(5000);
              return mock({
                error: false,
                'data|1-10': [
                  {
                    text: '@word',
                  },
                ],
              });
            },
          }}
        ></OSTrigger>
      </Space>
    </OSProviderWrapper>
  );
};

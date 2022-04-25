import { OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Space } from 'antd';
import delay from 'delay';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSTrigger
          type="button"
          settings={{
            text: '按钮1',
            tooltip: 'tooltip',
          }}
          requests={{
            requestAfterClick: async () => {
              await delay(1000);
            },
          }}
        ></OSTrigger>

        <OSTrigger
          type="button"
          settings={{
            text: '同步更新',
            tooltip: 'tooltip',
          }}
          requests={{
            requestAfterSync: async () => {
              await delay(1000);
            },
          }}
        ></OSTrigger>

        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮3',
            tooltip: 'tooltip',
          }}
          requests={{
            requestAfterMenuClick: async () => {
              await delay(1000);
            },
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
            tooltip: 'tooltip',
            split: true,
          }}
          requests={{
            requestAfterClick: async () => {
              await delay(1000);
            },
            requestAfterMenuClick: async () => {
              await delay(1000);
            },
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

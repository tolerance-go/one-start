import { OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Space } from 'antd';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSTrigger
          type="button"
          settings={{
            text: '按钮1',
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
            menu: [
              {
                text: 'menu1',
              },
              {
                text: 'menu2',
              },
            ],
          }}
          requests={{
            requestAfterMenuClick: async () => {
              await delay(1000);
            },
          }}
        ></OSTrigger>

        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮4',
            split: true,
            menu: [
              {
                text: 'menu1',
              },
              {
                text: 'menu2',
              },
            ],
          }}
          requests={{
            requestAfterClick: async () => {
              await delay(1000);
            },
            requestAfterMenuClick: async () => {
              await delay(1000);
            },
          }}
        ></OSTrigger>
      </Space>
    </OSProviderWrapper>
  );
};

import { UploadOutlined } from '@ant-design/icons';
import { OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Divider, Space } from '@ty/antd';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space split={<Divider type="vertical" />}>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            plain: true,
            menu: [
              {
                text: 'menu1',
              },
              {
                text: 'menu1',
                tooltip: 'tooltip1',
              },
              {
                text: 'menu1',
                icon: <UploadOutlined />,
              },
              {
                text: 'menu1',
                tooltip: 'tooltip1',
                icon: <UploadOutlined />,
              },
              {
                text: 'menu1',
                disabled: true,
                tooltip: 'tooltip1',
                icon: <UploadOutlined />,
              },
              {
                text: 'menu1',
                danger: true,
                tooltip: 'tooltip1',
                icon: <UploadOutlined />,
              },
              {
                text: 'menu1-disabled-upload',
                disabled: true,
                tooltip: 'tooltip1',
                icon: <UploadOutlined />,
                upload: {
                  multiple: true,
                  suffixs: ['.xlsx'],
                },
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

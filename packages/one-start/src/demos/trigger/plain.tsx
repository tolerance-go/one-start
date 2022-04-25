import { UploadOutlined } from '@ant-design/icons';
import { OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Divider, Space } from 'antd';
import delay from 'delay';
import { Random } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space split={<Divider type="vertical" />}>
        <span>
          {Random.word()}
          <OSTrigger
            type="button"
            settings={{
              text: '按钮1',
              plain: true,
            }}
            requests={{
              requestAfterClick: async () => {
                await delay(1000);
              },
            }}
          ></OSTrigger>
          {Random.word()}
        </span>
        <OSTrigger
          type="button"
          settings={{
            text: '按钮1',
            tooltip: 'tooltip1',
            plain: true,
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
            text: '按钮1',
            icon: <UploadOutlined />,
            plain: true,
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
            text: '按钮1',
            plain: true,
            tooltip: 'tooltip1',
            icon: <UploadOutlined />,
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
            text: '按钮1',
            plain: true,
            disabled: true,
            tooltip: 'tooltip1',
            icon: <UploadOutlined />,
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
            text: '按钮1',
            plain: true,
            danger: true,
            tooltip: 'tooltip1',
            icon: <UploadOutlined />,
          }}
          requests={{
            requestAfterClick: async () => {
              await delay(1000);
            },
          }}
        ></OSTrigger>
      </Space>
      <Divider />
      <Space split={<Divider type="vertical" />}>
        <span>
          {Random.word()}
          <OSTrigger
            type="dropdown"
            settings={{
              text: '按钮1',
              plain: true,
              menu: [
                {
                  text: 'menu1',
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
          {Random.word()}
        </span>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            plain: true,
            tooltip: 'tooltip1',
            menu: [
              {
                text: 'menu1',
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
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            plain: true,
            icon: <UploadOutlined />,
            menu: [
              {
                text: 'menu1',
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
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            plain: true,
            tooltip: 'tooltip1',
            icon: <UploadOutlined />,
            menu: [
              {
                text: 'menu1',
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
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            plain: true,
            disabled: true,
            tooltip: 'tooltip1',
            icon: <UploadOutlined />,
            menu: [
              {
                text: 'menu1',
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

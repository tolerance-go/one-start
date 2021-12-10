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
            text: '按钮1',
            tooltip: 'tooltip1',
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
      <Divider></Divider>
      <Space split={<Divider type="vertical" />}>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
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
          }}
        ></OSTrigger>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
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
          }}
        ></OSTrigger>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
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
          }}
        ></OSTrigger>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
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
          }}
        ></OSTrigger>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮-disabled',
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
          }}
        ></OSTrigger>
      </Space>
      <Divider />
      <Space split={<Divider type="vertical" />}>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            split: true,
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
          }}
        ></OSTrigger>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            split: true,
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
          }}
        ></OSTrigger>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            split: true,
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
          }}
        ></OSTrigger>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            tooltip: 'tooltip1',
            split: true,
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
          }}
        ></OSTrigger>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮-disabled',
            split: true,
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
          }}
        ></OSTrigger>
      </Space>
    </OSProviderWrapper>
  );
};

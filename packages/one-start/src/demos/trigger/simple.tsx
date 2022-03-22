import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Divider, Row, Space } from '@ty/antd';
import delay from 'delay';
import React from 'react';
import { OSDialog } from '../../components';

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
      <Divider />
      <Space split={<Divider type="vertical" />}>
        <OSTrigger
          type="icon"
          settings={{
            content: <InfoCircleOutlined />,
          }}
          requests={{
            requestAfterClick: async () => {
              await delay(1000);
            },
          }}
        ></OSTrigger>
        <OSTrigger
          type="icon"
          settings={{
            content: <InfoCircleOutlined />,
            disabled: true,
          }}
          requests={{
            requestAfterClick: async () => {
              await delay(1000);
            },
          }}
        ></OSTrigger>
        <OSDialog
          type="popover"
          // ref={dialogPopoverRef}
          settings={{
            title: <Row>最近计算运行结果</Row>,
            content: <div style={{ width: 250 }}>xxxxx</div>,
          }}
        >
          <OSTrigger
            type="icon"
            settings={{
              content: <InfoCircleOutlined />,
            }}
            requests={{
              requestAfterClick: async () => {
                await delay(1000);
              },
            }}
          ></OSTrigger>
        </OSDialog>
        <OSDialog
          type="modal"
          settings={{
            title: 'modal',
          }}
        >
          <OSTrigger
            type="icon"
            settings={{
              content: <InfoCircleOutlined />,
            }}
            requests={{
              requestAfterClick: async () => {
                await delay(1000);
              },
            }}
          ></OSTrigger>
        </OSDialog>
        <OSTrigger
          type="button"
          settings={{
            text: '按钮',
            icon: (
              <OSDialog
                type="popover"
                // ref={dialogPopoverRef}
                settings={{
                  title: <Row>最近计算运行结果</Row>,
                  content: <div style={{ width: 250 }}>xxxxx</div>,
                }}
              >
                <OSTrigger
                  type="icon"
                  settings={{
                    content: <InfoCircleOutlined />,
                  }}
                  requests={{
                    requestAfterClick: async () => {
                      await delay(1000);
                    },
                  }}
                ></OSTrigger>
              </OSDialog>
            ),
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
            text: '按钮',
            mergeIconInLoading: false,
            icon: (
              <OSDialog
                type="popover"
                // ref={dialogPopoverRef}
                settings={{
                  title: <Row>最近计算运行结果</Row>,
                  content: <div style={{ width: 250 }}>xxxxx</div>,
                }}
              >
                <OSTrigger
                  type="icon"
                  settings={{
                    content: <InfoCircleOutlined />,
                  }}
                  requests={{
                    requestAfterClick: async () => {
                      await delay(1000);
                    },
                  }}
                ></OSTrigger>
              </OSDialog>
            ),
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

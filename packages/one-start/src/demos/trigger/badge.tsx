import { UploadOutlined } from '@ant-design/icons';
import { OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Col, Row } from 'antd';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Row align="bottom" gutter={20}>
        <Col>
          <OSTrigger
            type="button"
            settings={{
              text: '按钮1',
              badge: {
                type: 'count',
                settings: {
                  count: 99,
                },
              },
            }}
            requests={{
              requestAfterClick: async () => {
                await delay(1000);
              },
            }}
          ></OSTrigger>
        </Col>
        <Col>
          <OSTrigger
            type="dropdown"
            settings={{
              split: true,
              badge: {
                type: 'ribbon',
                settings: {
                  text: '测试文案',
                },
              },
              text: '按钮1',
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
        </Col>
      </Row>
    </OSProviderWrapper>
  );
};

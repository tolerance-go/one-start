import React from 'react';
import { Descriptions } from '@ty/antd';
import { PageContainer } from '@ty-one-components/frame';

export default () => (
  <div
    style={{
      background: '#F5F7FA',
    }}
  >
    <PageContainer
      ghost
      header={{
        title: '页面标题',
        breadcrumb: {},
      }}
      content={
        <Descriptions column={2} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="创建人">曲丽丽</Descriptions.Item>
          <Descriptions.Item label="关联表单">
            <a>421421</a>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">2017-01-10</Descriptions.Item>
          <Descriptions.Item label="单据备注">浙江省杭州市西湖区工专路</Descriptions.Item>
        </Descriptions>
      }
    ></PageContainer>
  </div>
);

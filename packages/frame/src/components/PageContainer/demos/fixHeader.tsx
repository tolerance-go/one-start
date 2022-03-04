import React from 'react';
import { PageContainer } from '@ty-one-components/frame';

export default () => (
  <div
    style={{
      background: '#F5F7FA',
    }}
  >
    <PageContainer
      fixedHeader
      header={{
        title: '页面标题',
        breadcrumb: {
          routes: [
            {
              path: '',
              breadcrumbName: '一级页面',
            },
            {
              path: '',
              breadcrumbName: '二级页面',
            },
            {
              path: '',
              breadcrumbName: '当前页面',
            },
          ],
        },
      }}
      tabList={[
        {
          tab: '已选择',
          key: '1',
        },
        {
          tab: '可点击',
          key: '2',
        },
        {
          tab: '禁用',
          key: '3',
          disabled: true,
        },
      ]}
    ></PageContainer>
  </div>
);

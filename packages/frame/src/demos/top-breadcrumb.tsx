import React from 'react';

import ProLayout, { PageContainer, ProBreadcrumb } from '@ty-one-components/frame';

export default () => (
  <div
    style={{
      height: '100vh',
    }}
  >
    <ProLayout
      location={{
        pathname: '/admin/process/edit/123',
      }}
      ErrorBoundary={false}
      headerContentRender={() => <ProBreadcrumb />}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '主页',
        },
        {
          path: '/',
          breadcrumbName: '测试页',
        },
        ...routers,
      ]}
      menuDataRender={() => [
        {
          path: '/welcome',
          name: '欢迎',
        },
        {
          path: '/admin',
          name: '管理',
          routes: [
            {
              name: '申请单列表',
              path: '/admin/process',
            },
            {
              name: '申请单详情',
              path: '/admin/process/detail/:id',
              hideInMenu: true,
            },
            {
              name: '编辑申请单',
              path: '/admin/process/edit/:id',
              hideInMenu: true,
            },
            {
              name: '添加申请单',
              path: '/admin/process/add',
              hideInMenu: true,
            },
          ],
        },
      ]}
    >
      <PageContainer content="欢迎使用" breadcrumbRender={false}>
        <div>Hello World</div>
      </PageContainer>
    </ProLayout>
  </div>
);

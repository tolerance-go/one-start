import React, { useRef } from 'react';
import ProLayout, { PageContainer } from '@ty-one-components/frame';
import { Button } from '@ty/antd';
import customMenuDate from './customMenu';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const actionRef = useRef<{
    reload: () => void;
  }>();
  return (
    <>
      <ProLayout
        style={{
          height: '100vh',
          border: '1px solid #ddd',
        }}
        actionRef={actionRef}
        menu={{
          request: async () => {
            await waitTime(2000);
            return customMenuDate;
          },
        }}
        location={{
          pathname: '/welcome/welcome',
        }}
      >
        <PageContainer content="欢迎使用">
          Hello World
          <Button
            style={{
              margin: 8,
            }}
            onClick={() => {
              actionRef.current?.reload();
            }}
          >
            刷新菜单
          </Button>
        </PageContainer>
      </ProLayout>
    </>
  );
};

/**
 * iframe: 500
 */
import { OSPage, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSPage
        settings={{
          title: '页面标题',
          breadcrumb: [
            {
              path: '',
              name: '主页',
            },
            {
              path: '',
              name: '上级页面',
            },
          ],
          content: (
            <div
              style={{
                background: '#ccc',
                height: 400,
              }}
            ></div>
          ),
        }}
      />
    </OSProviderWrapper>
  );
};

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
          content: {
            tab1: (
              <div
                style={{
                  background: '#ccc',
                  height: 400,
                }}
              ></div>
            ),
            tab2: (
              <div
                style={{
                  background: '#ddd',
                  height: 400,
                }}
              ></div>
            ),
          },
          tabs: [
            {
              title: '标题1',
              key: 'tab1',
            },
            {
              title: '标题2',
              key: 'tab2',
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};

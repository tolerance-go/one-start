/**
 * iframe: 500
 */
import type { OSPageAPI } from '@ty-one-start/one-start';
import { OSPage, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import React, { useRef } from 'react';

export default () => {
  const pageRef = useRef<OSPageAPI>(null);

  return (
    <OSProviderWrapper>
      <OSPage
        ref={pageRef}
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
          actions: [
            <OSTrigger
              type={'button'}
              settings={{
                text: '跳转到第二页',
              }}
              onClick={() => {
                pageRef.current?.openTab({
                  tabKey: 'tab2',
                });
              }}
            />,
            <OSTrigger
              type={'button'}
              settings={{
                text: '跳转到第一页',
              }}
              onClick={() => {
                pageRef.current?.openTab({
                  tabKey: 'tab1',
                });
              }}
            />,
          ],
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

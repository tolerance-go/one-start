/**
 * iframe: 500
 */
import { OSPage, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
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
          actions: [
            <OSTrigger
              type={'button'}
              settings={{
                text: '操作1',
              }}
            />,
            <OSTrigger
              type={'dropdown'}
              settings={{
                text: '操作2',
                menu: [
                  {
                    text: 'menu1',
                  },
                  {
                    text: 'menu2',
                  },
                ],
              }}
            />,
          ],
          tabs: [
            {
              title: '标题1',
              actions: [
                <OSTrigger
                  type={'button'}
                  settings={{
                    text: '操作1',
                  }}
                />,
              ],
            },
            {
              title: '标题2',
              actions: [
                <OSTrigger
                  type={'button'}
                  settings={{
                    text: '操作2',
                  }}
                />,
              ],
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};

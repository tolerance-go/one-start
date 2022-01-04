/**
 * iframe: 350
 * desc: 页面间数据状态切换时将保存
 */
import {
  OSDateField,
  OSDigitField,
  OSFrame,
  OSMoneyField,
  OSProviderWrapper,
} from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSFrame
        settings={{
          pageMaps: {
            page1: (
              <div>
                page1 <OSMoneyField mode="edit" />
              </div>
            ),
            page2: (
              <div>
                page2 <OSDigitField mode="edit" />
              </div>
            ),
            page3: (
              <div>
                page3 <OSDateField mode="edit" />
              </div>
            ),
          },
          navData: [
            {
              title: '页面1',
              key: 'page1',
            },
            {
              title: '页面2',
              key: 'page2',
            },
            {
              title: '页面3',
              key: 'page3',
            },
          ],
        }}
      ></OSFrame>
    </OSProviderWrapper>
  );
};

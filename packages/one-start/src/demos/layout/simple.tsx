/**
 * iframe: 350
 */
import { BarChartOutlined } from '@ant-design/icons';
import { OSLayout, OSProviderWrapper } from '@ty-one-start/one-start';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSLayout
        settings={{
          navData: mock({
            'data|10': [
              {
                title: '@word',
                icon: () => <BarChartOutlined />,
                children: () =>
                  mock({
                    'data|0-3': [
                      {
                        title: '@word',
                      },
                    ],
                  }).data,
              },
            ],
          }).data,
        }}
      ></OSLayout>
    </OSProviderWrapper>
  );
};

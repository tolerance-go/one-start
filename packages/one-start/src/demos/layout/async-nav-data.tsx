/**
 * iframe: 350
 */
import { BarChartOutlined } from '@ant-design/icons';
import { OSLayout, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSLayout
        settings={{}}
        requests={{
          requestNavData: async () => {
            await delay(1500);
            return mock({
              error: false,
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
            });
          },
        }}
      ></OSLayout>
    </OSProviderWrapper>
  );
};

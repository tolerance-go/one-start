import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          fieldItems: [
            {
              type: 'tree-select',
              settings: {
                title: '页面权限',
                dataIndex: 'pagePermissions',
                multiple: true,
                showCheckedStrategy: 'SHOW_CHILD',
                dropdownHeight: 500,
              },
              requests: {
                requestOptions: async () => {
                  await delay(1000);
                  return mock({
                    error: false,
                    'data|200': [
                      {
                        value: '@word',
                        label() {
                          return this.value;
                        },
                      },
                    ],
                  });
                },
              },
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};

import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
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
              },
              requests: {
                requestOptions: async () => {
                  return {
                    error: false,
                    data: [
                      {
                        value: 'a',
                        label: 'A',
                        disabled: true,
                      },
                    ],
                  };
                },
              },
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};

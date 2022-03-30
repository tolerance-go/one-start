import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
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
                dropdownContentStyle: {
                  height: 500,
                },
              },
              requests: {
                requestOptions: async ({ form }) => {
                  await delay(1000);
                  console.log("form?.getFieldValue('text')", form?.getFieldValue('text'));
                  return {
                    error: false,
                    data: [
                      {
                        value: 'a',
                        label: 'A',
                      },
                    ].filter((item) => form?.getFieldValue('text') === item.value),
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

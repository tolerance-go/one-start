import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
                valueLinkage: {
                  linkage: (changedValues) => {
                    if ('money' in changedValues) {
                      return {
                        digit: changedValues.money * 2,
                      };
                    }
                    return {};
                  },
                },
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
                valueAsyncLinkage: {
                  serial: {
                    afterIndexIdRegisted: ['digit'],
                    linkage: async (changedValues) => {
                      if ('digit' in changedValues) {
                        if (changedValues.digit > 500) {
                          await delay(1500);
                          return {
                            percent: changedValues.digit,
                          };
                        }
                      }
                      return {};
                    },
                  },
                },
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
              },
            },
            {
              type: 'select',
              settings: {
                title: 'select',
                dataIndex: 'select',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
              },
            },
            {
              type: 'select',
              settings: {
                title: 'select-async',
                dataIndex: 'select-async',
              },
              requests: {
                requestOptions: async () => {
                  await delay(1000);
                  return mock({
                    error: false,
                    'data|1-20': [
                      {
                        label: '@word',
                        value() {
                          return this.label;
                        },
                      },
                    ],
                  });
                },
              },
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
              },
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};

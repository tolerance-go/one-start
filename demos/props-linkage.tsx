import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock } from 'mockjs';
import type { Moment } from 'moment';
import moment from 'moment';
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
              dependencies: ['digit'],
              settings: ({ form }) => {
                const digit = form.getFieldValue('digit');
                return {
                  title: 'money',
                  dataIndex: 'money',
                  rules:
                    digit > 100
                      ? [
                          {
                            required: true,
                          },
                          {
                            ruleType: 'digital-scope',
                            settings: {
                              max: 5000,
                              maxType: 'isLessThan',
                            },
                          },
                        ]
                      : undefined,
                  warningRules:
                    digit > 100
                      ? [
                          {
                            ruleType: 'digital-scope',
                            settings: {
                              max: 1000,
                              maxType: 'isLessThan',
                            },
                          },
                        ]
                      : undefined,
                };
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
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
              dependencies: ['date'],
              settings: ({ form }) => ({
                title: 'select',
                dataIndex: 'select',
                valueEnums: (form.getFieldValue('date') as Moment | undefined)?.isSame(
                  moment(),
                  'd',
                )
                  ? {
                      b: 'B',
                      c: 'C',
                    }
                  : {
                      a: 'A',
                      b: 'B',
                      c: 'C',
                    },
              }),
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

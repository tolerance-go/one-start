import { OSTable, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock, Random } from 'mockjs';
import type { Moment } from 'moment';
import moment from 'moment';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                search: true,
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
                search: true,
              },
            },
            {
              type: 'select',
              dependencies: ['date'],
              settings: ({ form }) => ({
                search: true,
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
        requests={{
          requestDataSource: async () => {
            await delay(1500);
            return mock({
              error: false,
              data: {
                'page|20': [
                  {
                    money: () => Random.integer(),
                    digit: () => Random.integer(),
                    percent: () => Random.integer(),
                    date: () => moment(),
                    'date-range': () => [moment(), moment()],
                    select: () => Random.pick(['a', 'b', 'c']),
                    text: () => Random.word(),
                    textarea: () => Random.paragraph(),
                  },
                ],
                total: 20,
              },
            });
          },
        }}
      />
    </OSProviderWrapper>
  );
};

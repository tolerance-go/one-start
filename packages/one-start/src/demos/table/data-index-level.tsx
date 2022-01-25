import { OSProviderWrapper, OSTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock from 'mockjs';
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
                dataIndex: ['money', 'value'],
                rules: [
                  {
                    required: true,
                  },
                ],
                fixed: 'left',
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: ['percent', 'value'],
              },
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: ['text', 'value'],
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: ['textarea', 'value'],
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: ['date', 'value'],
              },
            },
            {
              type: 'date-range',
              settings: {
                title: 'date-range',
                dataIndex: ['date-range', 'value'],
              },
            },
            {
              type: 'group',
              settings: {
                title: '分组1',
              },
              children: [
                {
                  type: 'money',
                  settings: {
                    title: 'money2',
                    dataIndex: ['money2', 'value'],
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'percent',
                  settings: {
                    title: 'percent2',
                    dataIndex: ['percent2', 'value'],
                  },
                },
                {
                  type: 'select',
                  settings: {
                    search: true,
                    title: 'select',
                    dataIndex: ['select', 'value'],
                    valueEnums: {
                      a: 'A',
                      b: 'B',
                    },
                  },
                },
                {
                  type: 'select',
                  settings: {
                    search: true,
                    title: 'select2',
                    dataIndex: ['select2', 'value'],
                    showSearch: true,
                    mode: 'multiple',
                  },
                  requests: {
                    requestOptions: async () => {
                      await delay(1000);
                      return Mock.mock({
                        error: false,
                        'data|1-100': [
                          {
                            label: '@word',
                            value: '@word',
                          },
                        ],
                      });
                    },
                  },
                },
              ],
            },
          ],
        }}
        requests={{
          requestDataSource: async (options) => {
            console.log(options);

            await delay(1000);

            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    text: () => ({ value: Mock.Random.word() }),
                    textarea: () => ({ value: Mock.Random.paragraph() }),
                    digit: () => ({ value: Mock.Random.integer() }),
                    date: () => ({ value: Mock.Random.date() }),
                    'date-range': () => ({ value: [Mock.Random.date(), Mock.Random.date()] }),
                    money: () => ({ value: Mock.Random.integer() }),
                    percent: () => ({ value: Mock.Random.integer() }),
                    money2: () => ({ value: Mock.Random.integer() }),
                    percent2: () => ({ value: Mock.Random.integer() }),
                    select: () => ({ value: 'a' }),
                    select2: () => ({ value: 'a' }),
                  },
                ],
                total: () => Mock.Random.integer(50, 100),
              },
            });
          },
        }}
      ></OSTable>
    </OSProviderWrapper>
  );
};

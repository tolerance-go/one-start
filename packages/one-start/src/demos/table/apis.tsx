import { OSProviderWrapper, OSTable } from '@ty-one-start/one-start';
import { Button } from 'antd';
import delay from 'delay';
import Mock from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          actions: ({ actions }) => {
            return [
              <Button
                onClick={() =>
                  actions.setDataSource(
                    Mock.mock({
                      error: false,
                      data: {
                        'page|20': [
                          {
                            id: '@id',
                            text: () => Mock.Random.word(),
                            textarea: () => Mock.Random.paragraph(),
                            digit: () => Mock.Random.integer(),
                            date: () => Mock.Random.date(),
                            'date-range': () => [Mock.Random.date(), Mock.Random.date()],
                            money: '@integer',
                            percent: '@integer',
                            money2: '@integer',
                            percent2: '@integer',
                            select: () => 'a',
                            select2: () => 'a',
                          },
                        ],
                        total: () => Mock.Random.integer(50, 100),
                      },
                    }).data.page,
                  )
                }
              >
                setDataSource
              </Button>,
              <Button onClick={() => actions.reload()}>reload</Button>,
              <Button onClick={() => alert(JSON.stringify(actions.getSearchFormCurrentValues()))}>
                getSerachFormCurrentValues
              </Button>,
              <Button
                onClick={() =>
                  actions.setSearchFormCurrentValues({
                    text: 'hi',
                    percent: 100,
                  })
                }
              >
                setSearchFormCurrentValues
              </Button>,
            ];
          },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                rules: [
                  {
                    required: true,
                  },
                ],
                fixed: 'left',
                resizeable: false,
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
                search: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
                configable: true,
                search: true,
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
                configable: true,
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
                configable: true,
              },
            },
            {
              type: 'date-range',
              settings: {
                title: 'date-range',
                dataIndex: 'date-range',
                configable: true,
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
                    dataIndex: 'money2',
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
                    dataIndex: 'percent2',
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
                    },
                  },
                },
                {
                  type: 'select',
                  settings: {
                    title: 'select2',
                    dataIndex: 'select2',
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
                    text: () => Mock.Random.word(),
                    textarea: () => Mock.Random.paragraph(),
                    digit: () => Mock.Random.integer(),
                    date: () => Mock.Random.date(),
                    'date-range': () => [Mock.Random.date(), Mock.Random.date()],
                    money: '@integer',
                    percent: '@integer',
                    money2: '@integer',
                    percent2: '@integer',
                    select: () => 'a',
                    select2: () => 'a',
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

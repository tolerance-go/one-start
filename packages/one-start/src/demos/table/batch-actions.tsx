import { OSProviderWrapper, OSTable, OSTrigger } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          /** batchOperation */
          batchOperation: () => {
            return [
              <OSTrigger
                type="button"
                settings={{
                  text: '批量下载',
                  type: 'primary',
                }}
              ></OSTrigger>,
              <OSTrigger
                type="button"
                settings={{
                  text: '批量导出',
                  type: 'primary',
                }}
              ></OSTrigger>,
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
                sorter: true,
                search: true,
              },
            },
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
                sorter: true,
                search: true,
              },
            },
            {
              type: 'money',
              settings: {
                title: 'money3',
                dataIndex: 'money3',
                rules: [
                  {
                    required: true,
                  },
                ],
                sorter: true,
                search: true,
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
                    search: true,
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
                    search: true,
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

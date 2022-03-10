import { OSProviderWrapper, OSTable, OSTrigger } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock, { Random } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          rowSelection: {
            quicklyBulkSelection: true,
            defaultSelectAllAfterSearch: true,
          },
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
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
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
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
                search: true,
              },
            },
            {
              type: 'group',
              settings: {
                title: '分组',
              },
              children: [
                {
                  type: 'text',
                  settings: {
                    title: 'text',
                    dataIndex: 'text',
                    search: true,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'textarea',
                  settings: {
                    title: 'textarea',
                    dataIndex: 'textarea',
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
              ],
            },
          ],
        }}
        requests={{
          requestDataSource: async () => {
            await delay(1000);

            return Mock.mock({
              error: false,
              data: {
                'page|100': [
                  {
                    id: '@id',
                    money: '@integer',
                    digit: '@integer',
                    percent: '@integer',
                    date: '@date',
                    text: '@word',
                    textarea: '@word',
                    select: () => Random.pick(['a', 'b']),
                  },
                ],
                total: 100,
              },
            });
          },
        }}
      ></OSTable>
    </OSProviderWrapper>
  );
};

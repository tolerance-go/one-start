import { OSProviderWrapper, OSTable, OSTrigger } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          actions: ({ actions }) => ({
            left: [
              <OSTrigger
                type="button"
                settings={{
                  text: '保存',
                  type: 'primary',
                }}
                onClick={() => {
                  console.log(actions.getTableFormEditedData?.());
                }}
              />,
            ],
          }),
          enableEditedCellDiffValueState: {},
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                    editable: true,
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
                    editable: true,
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
          requestDataSource: async (options) => {
            console.log(options);

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
                    text: '@word',
                    textarea: '@word',
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

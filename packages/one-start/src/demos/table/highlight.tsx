/**
 * transform: true
 */
import { OSProviderWrapper, OSTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock, { Random } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          fieldItems: [
            {
              type: 'money',
              settings: ({ rowData }) => ({
                title: 'money',
                dataIndex: 'money',
                rules: [
                  {
                    required: true,
                  },
                ],
                search: true,
                sorter: true,
                highlight: (rorData_) => ({
                  type: (() => {
                    if (rorData_?.money > 0) {
                      return 'error';
                    }
                    if (rorData_?.money < 0) {
                      return 'warning';
                    }
                    return undefined;
                  })(),
                }),
                cellTooltip: rowData?.money > 0 ? ['提示信息', '提示内容'] : undefined,
              }),
            },
            {
              type: 'percent',
              settings: ({ rowData }) => ({
                title: 'percent',
                dataIndex: 'percent',
                rules: [
                  {
                    required: true,
                  },
                ],
                search: true,
                sorter: true,
                highlight: (rorData_) => ({
                  type: (() => {
                    if (rorData_?.percent > 0) {
                      return 'error';
                    }
                    if (rorData_?.percent < 0) {
                      return 'warning';
                    }
                    return undefined;
                  })(),
                }),
                cellTooltip: rowData?.percent > 0 ? ['提示信息', '提示内容'] : undefined,
              }),
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
                search: true,
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
                search: true,
              },
            },
            {
              type: 'group',
              settings: {
                title: '分组1',
              },
              children: [
                {
                  type: 'digit',
                  settings: {
                    title: 'digit',
                    dataIndex: 'digit',
                    search: true,
                    rules: [
                      {
                        required: true,
                      },
                    ],
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
                  type: 'date-range',
                  settings: {
                    title: 'date-range',
                    dataIndex: 'date-range',
                    search: true,
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
                      c: 'C',
                    },
                  },
                },
                {
                  type: 'select',
                  settings: {
                    search: true,
                    title: 'select-search',
                    dataIndex: 'select-search',
                    showSearch: true,
                    mode: 'multiple',
                  },
                  requests: {
                    requestOptions: async () => {
                      await delay(1000);
                      return Promise.resolve({
                        error: false,
                        data: [
                          { value: 'a', label: 'A' },
                          { value: 'b', label: 'B' },
                          { value: 'c', label: 'C' },
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
                    money: () => Random.integer(),
                    percent: () => Random.integer(),
                    text: () => Random.word(),
                    textarea: () => Random.paragraph(),
                    digit: () => Random.integer(),
                    date: () => Random.date(),
                    'date-range': () => [Random.date(), Random.date()],
                    select: () => Random.pick(['a', 'b', 'c']),
                    'select-search': () => Random.pick(['a', 'b', 'c']),
                  },
                ],
                total: 20,
              },
            });
          },
        }}
      ></OSTable>
    </OSProviderWrapper>
  );
};

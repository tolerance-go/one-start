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
                dataIndex: 'money',
                rules: [
                  {
                    required: true,
                  },
                ],
                fixed: 'left',
                configable: true,
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
                configable: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
                configable: true,
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
                    configable: true,

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
                  type: 'select',
                  settings: {
                    title: 'select',
                    dataIndex: 'select',
                    configable: true,

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
                    title: 'select-search',
                    dataIndex: 'select-search',
                    configable: true,

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
                    money: () => Mock.Random.integer(),
                    percent: () => Mock.Random.integer(),
                    text: () => Mock.Random.word(),
                    textarea: () => Mock.Random.paragraph(),
                    digit: () => Mock.Random.integer(),
                    date: () => Mock.Random.date(),
                    'date-range': () => [Mock.Random.date(), Mock.Random.date()],
                    select: () => Mock.Random.pick(['a', 'b', 'c']),
                    'select-search': () => Mock.Random.pick(['a', 'b', 'c']),
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

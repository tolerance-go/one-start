import { OSProviderWrapper, OSTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          enableGridTree: true,
          fieldItems: [
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
              },
            },
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
              type: 'money',
              settings: {
                title: 'money4',
                dataIndex: 'money4',
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
                title: 'money5',
                dataIndex: 'money5',
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
                title: 'money6',
                dataIndex: 'money6',
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
                title: 'money7',
                dataIndex: 'money7',
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
                title: 'money8',
                dataIndex: 'money8',
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
                title: 'money9',
                dataIndex: 'money9',
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
              type: 'group',
              settings: {
                title: '分组1',
              },
              children: [
                {
                  type: 'money',
                  settings: {
                    title: 'money10',
                    dataIndex: 'money10',
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
                'page|10': [
                  {
                    id: '@id',
                    money: '@integer',
                    money1: '@integer',
                    money2: '@integer',
                    money3: '@integer',
                    money4: '@integer',
                    money5: '@integer',
                    money6: '@integer',
                    money7: '@integer',
                    money8: '@integer',
                    money9: '@integer',
                    money10: '@integer',
                    percent: '@integer',
                    percent2: '@integer',
                    select: () => 'a',
                    select2: () => 'a',
                    children: Mock.mock({
                      'page|5': [
                        {
                          id: '@id',
                          money: '@integer',
                          money1: '@integer',
                          money2: '@integer',
                          money3: '@integer',
                          money4: '@integer',
                          money5: '@integer',
                          money6: '@integer',
                          money7: '@integer',
                          money8: '@integer',
                          money9: '@integer',
                          money10: '@integer',
                          percent: '@integer',

                          percent2: '@integer',
                          select: () => 'a',
                          select2: () => 'a',
                          children: Mock.mock({
                            'page|5': [
                              {
                                id: '@id',
                                money: '@integer',
                                money1: '@integer',
                                money2: '@integer',
                                money3: '@integer',
                                money4: '@integer',
                                money5: '@integer',
                                money6: '@integer',
                                money7: '@integer',
                                money8: '@integer',
                                money9: '@integer',
                                money10: '@integer',
                                percent: '@integer',

                                percent2: '@integer',
                                select: () => 'a',
                                select2: () => 'a',
                                children: Mock.mock({
                                  'page|5': [
                                    {
                                      id: '@id',
                                      money: '@integer',
                                      percent: '@integer',
                                      money2: '@integer',
                                      percent2: '@integer',
                                      select: () => 'a',
                                      select2: () => 'a',
                                      children: Mock.mock({
                                        'page|5': [
                                          {
                                            id: '@id',
                                            money: '@integer',
                                            money1: '@integer',
                                            money2: '@integer',
                                            money3: '@integer',
                                            money4: '@integer',
                                            money5: '@integer',
                                            money6: '@integer',
                                            money7: '@integer',
                                            money8: '@integer',
                                            money9: '@integer',
                                            money10: '@integer',
                                            percent: '@integer',

                                            percent2: '@integer',
                                            select: () => 'a',
                                            select2: () => 'a',
                                            children: Mock.mock({
                                              'page|16': [
                                                {
                                                  id: '@id',
                                                  money: '@integer',
                                                  money1: '@integer',
                                                  money2: '@integer',
                                                  money3: '@integer',
                                                  money4: '@integer',
                                                  money5: '@integer',
                                                  money6: '@integer',
                                                  money7: '@integer',
                                                  money8: '@integer',
                                                  money9: '@integer',
                                                  money10: '@integer',
                                                  percent: '@integer',
                                                  percent2: '@integer',
                                                  select: () => 'a',
                                                  select2: () => 'a',
                                                },
                                              ],
                                            }).page,
                                          },
                                        ],
                                      }).page,
                                    },
                                  ],
                                }).page,
                              },
                            ],
                          }).page,
                        },
                      ],
                    }).page,
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

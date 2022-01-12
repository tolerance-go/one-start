import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock, Random } from 'mockjs';
import moment from 'moment';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          fieldItemSettings: {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
          },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                readonly: true,
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
                readonly: true,
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
                readonly: true,
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
                readonly: true,
              },
            },
            {
              type: 'date-range',
              settings: {
                title: 'date-range',
                dataIndex: 'date-range',
                readonly: true,
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
                  c: 'C',
                },
                readonly: true,
              },
            },
            {
              type: 'select',
              settings: {
                title: 'selectMultiple',
                dataIndex: 'selectMultiple',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
                mode: 'multiple',
                readonly: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
                readonly: true,
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
                readonly: true,
              },
            },
            {
              type: 'chain-select',
              settings: {
                title: 'chain-select',
                dataIndex: 'chain-select',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
                readonly: true,
              },
            },
            {
              type: 'editable-table',
              settings: {
                title: 'editable-table',
                dataIndex: 'editable-table',
                readonly: true,
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
                        },
                      },
                      {
                        type: 'date-range',
                        settings: {
                          title: 'date-range',
                          dataIndex: 'date-range',
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
                            c: 'C',
                          },
                        },
                      },
                      {
                        type: 'select',
                        settings: {
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
              },
            },
          ],
        }}
        requests={{
          requestRichDataSource: async () => {
            return Promise.resolve(
              mock({
                error: false,
                data: {
                  values: {
                    money: () => Random.integer(),
                    digit: () => Random.integer(),
                    percent: () => Random.integer(),
                    date: () => moment(Random.date()),
                    'date-range': () => [moment(Random.date()), moment(Random.date())],
                    select: () => Random.pick(['a', 'b', 'c']),
                    selectMultiple: () => [{ current: ['a', 'b'] }],
                    text: () => Random.word(),
                    textarea: () => Random.paragraph(),
                    'chain-select': () => ['a', 'b', 'c'],
                    'editable-table': () => {
                      return mock({
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
                      }).page;
                    },
                  },
                  history: {
                    money: () => {
                      return mock({ 'list|1-5': [{ current: () => Random.integer() }] }).list;
                    },
                    digit: () => {
                      return mock({ 'list|1-5': [{ current: () => Random.integer() }] }).list;
                    },
                    percent: () => {
                      return mock({ 'list|1-5': [{ current: () => Random.integer() }] }).list;
                    },
                    date: () => {
                      return mock({ 'list|1-5': [{ current: () => moment(Random.date()) }] }).list;
                    },
                    'date-range': () => {
                      return mock({
                        'list|1-5': [
                          { current: () => [moment(Random.date()), moment(Random.date())] },
                        ],
                      }).list;
                    },
                    select: () => {
                      return mock({ 'list|1-5': [{ current: () => Random.pick(['a', 'b', 'c']) }] })
                        .list;
                    },
                    selectMultiple: () =>
                      mock({ 'list|1-5': [{ current: () => ['a', 'b'] }] }).list,
                    text: () => {
                      return mock({ 'list|1-5': [{ current: () => Random.word() }] }).list;
                    },
                    textarea: () => {
                      return mock({ 'list|1-5': [{ current: () => Random.paragraph() }] }).list;
                    },
                    'chain-select': () => {
                      return mock({ 'list|1-5': [{ current: () => ['a', 'b', 'c'] }] }).list;
                    },
                    'editable-table': () => {
                      return mock({
                        'list|1-5': [
                          {
                            current: () =>
                              mock({
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
                              }).page,
                          },
                        ],
                      }).list;
                    },
                  },
                },
              }),
            );
          },
        }}
      />
    </OSProviderWrapper>
  );
};

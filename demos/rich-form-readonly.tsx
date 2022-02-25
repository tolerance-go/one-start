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
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          fieldItemSettings: {
            readonly: true,
          },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
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
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
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
            {
              type: 'form',
              settings: {
                title: 'form',
                dataIndex: 'form',
                fieldItems: [
                  {
                    type: 'money',
                    settings: {
                      title: 'money',
                      dataIndex: 'money',
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: 'digit',
                      dataIndex: 'digit',
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
                    type: 'date',
                    settings: {
                      title: 'date',
                      dataIndex: 'date',
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
              },
            },
            {
              type: 'layout-modal-form',
              settings: {
                title: 'layout-modal-form',
                dataIndex: 'layout-modal-form',
                buttonTriggerText: 'layout-modal-form',
                buttonTriggerSettings: {
                  type: 'link',
                },
                formSettings: {
                  fieldItems: [
                    {
                      type: 'money',
                      settings: {
                        title: 'money',
                        dataIndex: 'money',
                      },
                    },
                    {
                      type: 'digit',
                      settings: {
                        title: 'digit',
                        dataIndex: 'digit',
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
                      type: 'date',
                      settings: {
                        title: 'date',
                        dataIndex: 'date',
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
                },
              },
            },
            {
              type: 'editable-table',
              settings: {
                title: 'editable-table',
                dataIndex: 'editable-table',
                addable: {},
                fieldItems: [
                  {
                    type: 'money',
                    settings: {
                      title: 'money',
                      dataIndex: 'money',
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: 'digit',
                      dataIndex: 'digit',
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
                    type: 'date',
                    settings: {
                      title: 'date',
                      dataIndex: 'date',
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
                money: () => Random.integer(),
                digit: () => Random.integer(),
                percent: () => Random.integer(),
                date: () => moment(),
                'date-range': () => [moment(), moment()],
                select: () => Random.pick(['a', 'b', 'c']),
                text: () => Random.word(),
                textarea: () => Random.paragraph(),
                'layout-modal-form': {
                  money: () => Random.integer(),
                  digit: () => Random.integer(),
                  percent: () => Random.integer(),
                  date: () => moment(),
                  'date-range': () => [moment(), moment()],
                  select: () => Random.pick(['a', 'b', 'c']),
                  text: () => Random.word(),
                  textarea: () => Random.paragraph(),
                },
                form: {
                  money: () => Random.integer(),
                  digit: () => Random.integer(),
                  percent: () => Random.integer(),
                  date: () => moment(),
                  'date-range': () => [moment(), moment()],
                  select: () => Random.pick(['a', 'b', 'c']),
                  text: () => Random.word(),
                  textarea: () => Random.paragraph(),
                },
                'editable-table': [
                  {
                    id: () => Random.id(),
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
              },
            });
          },
        }}
      />
    </OSProviderWrapper>
  );
};

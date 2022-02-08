import { OSProviderWrapper, OSSourceTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSSourceTable
        settings={{
          rowRemoveable: ({ rowIndex }) => {
            return {
              triggerSettings: {
                disabled: rowIndex % 2 === 0,
              },
            };
          },
          rowViewable: ({ rowIndex }) => {
            return {
              formSettings: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
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
                      title: 'selectMultiple',
                      dataIndex: 'selectMultiple',
                      valueEnums: {
                        a: 'A',
                        b: 'B',
                        c: 'C',
                      },
                      mode: 'multiple',
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
              triggerSettings: {
                disabled: rowIndex % 2 === 0,
              },
            };
          },
          rowEditable: ({ rowIndex }) => {
            return {
              ...(rowIndex % 2 === 0
                ? {
                    formType: 'form',
                    formSettings: {
                      labelCol: { span: 4 },
                      wrapperCol: { span: 20 },
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
                            title: 'selectMultiple',
                            dataIndex: 'selectMultiple',
                            valueEnums: {
                              a: 'A',
                              b: 'B',
                              c: 'C',
                            },
                            mode: 'multiple',
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
                  }
                : {
                    formType: 'steps-form',
                    formSettings: {
                      steps: [
                        {
                          title: '模板解析要素',
                          key: 'tab1',
                        },
                        {
                          title: '基本信息&字段映射',
                          key: 'tab2',
                        },
                      ],
                      labelCol: { span: 4 },
                      wrapperCol: { span: 20 },
                      forms: {
                        tab1: {
                          settings: {
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
                            ],
                          },
                        },
                        tab2: {
                          settings: {
                            fieldItems: [
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
                                  title: 'selectMultiple',
                                  dataIndex: 'selectMultiple',
                                  valueEnums: {
                                    a: 'A',
                                    b: 'B',
                                    c: 'C',
                                  },
                                  mode: 'multiple',
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
                    },
                  }),
              triggerSettings: {
                disabled: rowIndex % 3 === 0,
              },
            };
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
          requestRemoveRow: async (options) => {
            console.log(options);
            await delay(1000);
            return {
              error: false,
              data: {
                message: '自定义删除成功消息',
              },
            };
          },
        }}
      ></OSSourceTable>
    </OSProviderWrapper>
  );
};

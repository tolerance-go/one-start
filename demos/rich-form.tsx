import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
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
                    settings: ({ form, rowId }) => {
                      const digit = form.getFieldValue([rowId!, 'digit']);
                      return {
                        title: 'money',
                        dataIndex: 'money',
                        rules:
                          digit > 100
                            ? [
                                {
                                  required: true,
                                },
                                {
                                  ruleType: 'digital-scope',
                                  settings: {
                                    max: 5000,
                                    maxType: 'isLessThan',
                                  },
                                },
                              ]
                            : undefined,
                        warningRules:
                          digit > 100
                            ? [
                                {
                                  ruleType: 'digital-scope',
                                  settings: {
                                    max: 1000,
                                    maxType: 'isLessThan',
                                  },
                                },
                              ]
                            : undefined,
                      };
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
                ],
              },
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};

import type { RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType | undefined>([
    {
      id: '1',
    },
  ]);
  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSForm
        value={value}
        onChange={setValue}
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: 'text',
                title: 'text',
                autoFocus: true,
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
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
              },
            },
            {
              type: 'layout-tabs-form',
              settings: {
                title: 'layout-tabs-form',
                dataIndex: 'layout-tabs-form',
                tabs: [
                  {
                    title: 'tab1',
                  },
                  {
                    title: 'tab2',
                  },
                ],
                forms: {
                  tab1: {
                    settings: {
                      initialValues: {
                        money: 0,
                        digit: 234234,
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
                  tab2: {
                    settings: {
                      initialValues: {
                        money: 0,
                        digit: 234234,
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
                          type: 'date-range',
                          settings: {
                            title: 'date-range',
                            dataIndex: 'date-range',
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              type: 'layout-tabs-form',
              settings: {
                title: 'layout-tabs-form',
                dataIndex: 'layout-tabs-form',
                readonly: true,
                tabs: [
                  {
                    title: 'tab1',
                  },
                  {
                    title: 'tab2',
                  },
                ],
                forms: {
                  tab1: {
                    settings: {
                      initialValues: {
                        money: 0,
                        digit: 234234,
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
                  tab2: {
                    settings: {
                      initialValues: {
                        money: 0,
                        digit: 234234,
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
                          type: 'date-range',
                          settings: {
                            title: 'date-range',
                            dataIndex: 'date-range',
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

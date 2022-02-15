import type { RecordType } from '@ty-one-start/one-start';
import { OSLayoutForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import React, { useState } from 'react';

export default () => {
  const [values, setValues] = useState<RecordType | undefined>({
    tab1: {
      digit: 234234234234,
    },
  });

  return (
    <>
      <div>{JSON.stringify(values)}</div>

      <OSProviderWrapper>
        <OSLayoutForm
          type="steps-form"
          settings={{
            steps: [
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
                  ],
                },
              },
            },
          }}
          requests={{
            requestStepsFormDataSource: async () => {
              await delay(1000);
              return {
                error: false,
                data: [
                  {
                    money: 234234234234,
                    digit: 234234,
                    percent: 2342.34,
                    date: '2021-09-15T13:12:05.422Z',
                    'date-range': ['2021-09-08T13:12:06.868Z', '2021-10-10T13:12:06.868Z'],
                    select: 'a',
                    selectMultiple: ['b', 'a'],
                    text: '324',
                    textarea: '234',
                  },
                  {
                    money: 10000,
                    digit: 10000,
                    percent: 10000,
                  },
                ],
              };
            },
            requestWhenSubmit: async ({ values: values_ }) => {
              alert(JSON.stringify(values_));
              return {
                error: false,
                data: {
                  message: '自定义成功消息',
                },
              };
            },
            requestWhenNext: async (options) => {
              console.log('requestWhenNext', options);

              await delay(1000);

              return {
                error: false,
                data: {
                  message: '自定义成功消息',
                },
              };
            },
          }}
          value={values}
          onChange={setValues}
        />
      </OSProviderWrapper>
    </>
  );
};

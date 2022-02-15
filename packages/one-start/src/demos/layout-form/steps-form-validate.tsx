import type { OSDialogAPI, RecordType } from '@ty-one-start/one-start';
import { OSDialog, OSLayoutForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import delay from 'delay';
import React, { useRef, useState } from 'react';
import {
  calculateFormulaVerificationRules,
  increasingSymbol,
  oneOnOneMappingRule,
  oneToOneValueConversion,
} from './utils';

export const CreateTemplate = () => {
  const dialogRef = useRef<OSDialogAPI>(null);

  return (
    <OSDialog
      ref={dialogRef}
      type="modal"
      settings={{
        width: 600,
        title: '创建模板映射规则',
        body: (
          <OSLayoutForm
            type="steps-form"
            settings={{
              submitTriggerText: '确认创建',
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
              forms: {
                tab1: {
                  settings: {
                    fieldItemSettings: {
                      labelCol: {
                        span: 6,
                      },
                      wrapperCol: {
                        span: 18,
                      },
                    },
                    fieldItems: [
                      {
                        type: 'upload',
                        settings: {
                          title: '模板文件',
                          dataIndex: 'templateFile',
                          maxCount: 1,
                          rules: [
                            {
                              required: true,
                            },
                          ],
                          accept: '.xlsx,.xls',
                        },
                      },
                      {
                        type: 'text',
                        settings: {
                          title: 'sheet 名称',
                          dataIndex: 'sheetName',
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        },
                      },
                      {
                        type: 'text',
                        settings: {
                          title: '起始单元格',
                          dataIndex: 'startCell',
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        },
                      },
                      {
                        type: 'text',
                        settings: {
                          title: '终止单元格',
                          dataIndex: 'endCell',
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                tab2: {
                  settings: {
                    fieldItemSettings: {
                      labelCol: {
                        span: 6,
                      },
                      wrapperCol: {
                        span: 18,
                      },
                    },
                    fieldItems: [
                      {
                        type: 'group',
                        settings: {
                          title: '基本信息',
                        },
                        children: [
                          {
                            type: 'text',
                            settings: {
                              title: '模板名称',
                              dataIndex: 'templateName',
                              colSpan: 24,
                              rules: [
                                {
                                  required: true,
                                },
                              ],
                            },
                          },
                          {
                            type: 'placeholder-input',
                            dependencies: ['placeholders'],
                            settings: ({ form }) => ({
                              colSpan: 24,
                              title: '标的物名称匹配',
                              dataIndex: 'instrumentNameMatch',
                              placeholders: form.getFieldValue('placeholders'),
                              rules: [oneOnOneMappingRule],
                              valueTransform: oneToOneValueConversion,
                            }),
                          },
                          {
                            type: 'text',
                            settings: {
                              title: '方向(买)',
                              dataIndex: 'buy',
                              colSpan: 24,
                            },
                          },
                          {
                            type: 'text',
                            settings: {
                              title: '方向(卖)',
                              dataIndex: 'sell',
                              colSpan: 24,
                            },
                          },
                        ],
                      },
                      {
                        type: 'group',
                        settings: {
                          title: '字段映射',
                        },
                        children: [
                          {
                            type: 'placeholder-input',
                            dependencies: ['placeholders'],
                            settings: ({ form }) => ({
                              colSpan: 24,
                              title: '发生日期',
                              dataIndex: 'tradeDate',
                              placeholders: form.getFieldValue('placeholders'),
                              rules: [
                                {
                                  required: true,
                                },
                                oneOnOneMappingRule,
                              ],
                              valueTransform: oneToOneValueConversion,
                            }),
                          },
                          {
                            type: 'placeholder-input',
                            settings: ({ form }) => ({
                              colSpan: 24,
                              title: '标的物代码',
                              dataIndex: 'instrumentId',
                              placeholders: form.getFieldValue('placeholders'),
                              rules: [
                                {
                                  required: true,
                                },
                                oneOnOneMappingRule,
                              ],
                              valueTransform: oneToOneValueConversion,
                            }),
                          },
                          {
                            type: 'placeholder-input',
                            settings: ({ form }) => ({
                              colSpan: 24,
                              title: '方向',
                              dataIndex: 'direction',
                              placeholders: form.getFieldValue('placeholders'),
                              rules: [
                                {
                                  required: true,
                                },
                                oneOnOneMappingRule,
                              ],
                              valueTransform: oneToOneValueConversion,
                            }),
                          },
                          {
                            type: 'placeholder-input',
                            settings: ({ form }) => ({
                              colSpan: 24,
                              title: '成交价格',
                              dataIndex: 'dealPrice',
                              placeholders: increasingSymbol(form.getFieldValue('placeholders')),
                              rules: [
                                {
                                  required: true,
                                },
                                calculateFormulaVerificationRules,
                              ],
                            }),
                          },
                          {
                            type: 'placeholder-input',
                            settings: ({ form }) => ({
                              colSpan: 24,

                              title: '成交数量',
                              dataIndex: 'dealVolume',
                              placeholders: increasingSymbol(form.getFieldValue('placeholders')),
                              rules: [
                                {
                                  required: true,
                                },
                                calculateFormulaVerificationRules,
                              ],
                            }),
                          },
                          {
                            type: 'placeholder-input',
                            settings: ({ form }) => ({
                              colSpan: 24,

                              title: '成交金额',
                              dataIndex: 'dealAmount',
                              placeholders: increasingSymbol(form.getFieldValue('placeholders')),
                              rules: [
                                {
                                  required: true,
                                },
                                calculateFormulaVerificationRules,
                              ],
                            }),
                          },
                          {
                            type: 'placeholder-input',
                            settings: ({ form }) => ({
                              colSpan: 24,
                              title: '标的利率',
                              dataIndex: 'instrumentRate',
                              placeholders: increasingSymbol(form.getFieldValue('placeholders')),
                              rules: [calculateFormulaVerificationRules],
                            }),
                          },
                          {
                            type: 'placeholder-input',
                            settings: ({ form }) => ({
                              colSpan: 24,
                              title: '其他手续费',
                              dataIndex: 'otherPoundage',
                              placeholders: increasingSymbol(form.getFieldValue('placeholders')),
                              rules: [calculateFormulaVerificationRules],
                            }),
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            }}
          ></OSLayoutForm>
        ),
      }}
    >
      <OSTrigger
        type="button"
        settings={{
          type: 'primary',
          text: '创建',
        }}
      ></OSTrigger>
    </OSDialog>
  );
};

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
            // requestStepsFormDataSource: async () => {
            //   await delay(1000);
            //   return {
            //     error: false,
            //     data: {
            //       tab1: {
            //         money: 234234234234,
            //         digit: 234234,
            //         percent: 2342.34,
            //         date: '2021-09-15T13:12:05.422Z',
            //         'date-range': ['2021-09-08T13:12:06.868Z', '2021-10-10T13:12:06.868Z'],
            //         select: 'a',
            //         selectMultiple: ['b', 'a'],
            //         text: '324',
            //         textarea: '234',
            //       },
            //       tab2: {
            //         money: 10000,
            //         digit: 10000,
            //         percent: 10000,
            //       },
            //     },
            //   };
            // },
            requestInitialValues: async () => {
              await delay(1000);
              return {
                error: false,
                data: {
                  tab1: {
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
                  tab2: {
                    money: 10000,
                    digit: 10000,
                    percent: 10000,
                  },
                },
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
        <CreateTemplate />
      </OSProviderWrapper>
    </>
  );
};

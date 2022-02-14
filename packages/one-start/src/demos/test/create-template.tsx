import type { OSDialogAPI } from '@ty-one-start/one-start';
import { OSDialog, OSLayoutForm, OSTrigger } from '@ty-one-start/one-start';
import { message } from '@ty/antd';
import delay from 'delay';
import React, { useRef } from 'react';

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
                        type: 'text',
                        settings: {
                          title: 'sheet 名称',
                          dataIndex: 'sheet 名称',
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
                          dataIndex: '起始单元格',
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
                          dataIndex: '终止单元格',
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        },
                      },
                      {
                        type: 'upload',
                        settings: {
                          title: '模板文件',
                          dataIndex: '模板文件',
                          maxCount: 1,
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
                          title: '方向(买)',
                          dataIndex: '方向(买)',
                        },
                      },
                      {
                        type: 'text',
                        settings: {
                          title: '方向(卖)',
                          dataIndex: '方向(卖)',
                        },
                      },
                      {
                        type: 'text',
                        settings: {
                          title: '标的物名称匹配',
                          dataIndex: '标的物名称匹配',
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
                        type: 'text',
                        settings: {
                          title: '模板名称',
                          dataIndex: '模板名称',
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
                          title: '发生日期',
                          dataIndex: '发生日期',
                          placeholders: form.getFieldValue('placeholders'),
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        }),
                      },
                      {
                        type: 'placeholder-input',
                        settings: ({ form }) => ({
                          title: '标的物代码',
                          dataIndex: '标的物代码',
                          placeholders: form.getFieldValue('placeholders'),
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        }),
                      },
                      {
                        type: 'placeholder-input',
                        settings: ({ form }) => ({
                          title: '方向',
                          dataIndex: '方向',
                          placeholders: form.getFieldValue('placeholders'),
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        }),
                      },
                      {
                        type: 'placeholder-input',
                        settings: ({ form }) => ({
                          title: '成交价格',
                          dataIndex: '成交价格',
                          placeholders: form.getFieldValue('placeholders'),
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        }),
                      },
                      {
                        type: 'placeholder-input',
                        settings: ({ form }) => ({
                          title: '成交数量',
                          dataIndex: '成交数量',
                          placeholders: form.getFieldValue('placeholders'),
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        }),
                      },
                      {
                        type: 'placeholder-input',
                        settings: ({ form }) => ({
                          title: '成交金额',
                          dataIndex: '成交金额',
                          placeholders: form.getFieldValue('placeholders'),
                          rules: [
                            {
                              required: true,
                            },
                          ],
                        }),
                      },
                      {
                        type: 'placeholder-input',
                        settings: ({ form }) => ({
                          title: '标的利率',
                          dataIndex: '标的利率',
                          placeholders: form.getFieldValue('placeholders'),
                        }),
                      },
                      {
                        type: 'placeholder-input',
                        settings: ({ form }) => ({
                          title: '其他手续费',
                          dataIndex: '其他手续费',
                          placeholders: form.getFieldValue('placeholders'),
                        }),
                      },
                    ],
                  },
                },
              },
            }}
            requests={{
              requestWhenNext: async ({ current, formsRef }) => {
                formsRef.current?.[current + 1].current?.setFieldsValue({
                  placeholders: [
                    {
                      label: '+',
                      value: '+',
                      raw: true,
                    },
                    {
                      label: '-',
                      value: '-',
                      raw: true,
                    },
                    {
                      label: 'label1',
                      value: 'label1',
                    },
                    {
                      label: 'label2',
                      value: 'label2',
                    },
                    {
                      label: 'label3',
                      value: 'label3',
                    },
                    {
                      label: 'label4',
                      value: 'label4',
                    },
                  ],
                });

                await delay(1000);

                message.success('字段解析成功');

                return {
                  error: false,
                };
              },
              requestWhenSubmit: async (options) => {
                console.log('options', options);

                await delay(1000);

                dialogRef.current?.pop();

                return {
                  error: false,
                  data: {
                    message: '创建模板映射规则成功',
                  },
                };
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

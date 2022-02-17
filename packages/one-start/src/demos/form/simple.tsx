import type { RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { message } from '@ty/antd';
import utlFp from 'lodash/fp';
import React from 'react';
import { session } from 'store2';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          fieldItems: [
            {
              type: 'upload',
              settings: {
                title: 'upload',
                dataIndex: 'upload',
                immediately: true,
                data: { type: 'PARTY' },
                duplicationCheck: true,
                maxSize: 1,
                triggerButtonText: '上传',
              },
              requests: {
                requestAfterUpload: async ({ fileList, file }) => {
                  /** 标记上传状态 可用于未完成上传时不可进行提交操作的提醒  */
                  const recordStatus = () => {
                    session.set('uploadStatus', file.status);
                  };
                  if (!fileList || !fileList.length) {
                    return { data: [], error: false };
                  }
                  if (file?.response?.errorMessage) {
                    message.error(file.response.errorMessage);
                  }
                  recordStatus();
                  return { data: fileList.filter((item) => item.status !== 'error'), error: false };
                },
              },
            },
            {
              type: 'layout-modal-form',
              settings: {
                title: 'layout-modal-form',
                dataIndex: 'layoutModalForm',
                buttonTriggerText: '按钮1',
                modalDialogSettings: {
                  title: '标题',
                },
                formFieldItems: [
                  {
                    type: 'money',
                    settings: {
                      title: 'asyncValidate',
                      dataIndex: 'asyncValidate',
                      rules: [
                        { required: true },
                        {
                          validator: async (_, val) => {
                            // await delay(1000);
                            if (val < 10) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('error'));
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: 'layout-modal-form',
                    settings: {
                      title: 'layout-modal-form',
                      dataIndex: 'layoutModalForm',
                      buttonTriggerText: '按钮1',
                      modalDialogSettings: {
                        title: '标题',
                      },
                      formFieldItems: [
                        {
                          type: 'money',
                          settings: {
                            title: 'asyncValidate',
                            dataIndex: 'asyncValidate',
                            rules: [
                              { required: true },
                              {
                                validator: async (_, val) => {
                                  // await delay(1000);
                                  if (val < 10) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('error'));
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: 'editable-table',
                    settings: {
                      title: 'editable-table',
                      dataIndex: 'editableTable',
                      addable: {},
                      removeable: {},
                      fieldItems: [
                        {
                          type: 'money',
                          settings: {
                            title: 'asyncValidate',
                            dataIndex: 'asyncValidate',
                            rules: [
                              { required: true },
                              {
                                validator: async (_, val) => {
                                  // await delay(1000);
                                  if (val < 10) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('error'));
                                },
                              },
                            ],
                          },
                        },
                        {
                          type: 'layout-modal-form',
                          settings: {
                            title: 'layout-modal-form',
                            dataIndex: 'layoutModalForm',
                            buttonTriggerText: '按钮1',
                            modalDialogSettings: {
                              title: '标题',
                            },
                            formFieldItems: [
                              {
                                type: 'money',
                                settings: {
                                  title: 'asyncValidate',
                                  dataIndex: 'asyncValidate',
                                  rules: [
                                    { required: true },
                                    {
                                      validator: async (_, val) => {
                                        // await delay(1000);
                                        if (val < 10) {
                                          return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('error'));
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: 'placeholder-input',
              settings: {
                title: 'placeholder-input',
                dataIndex: 'placeholderInput',
                placeholders: [
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
                ],
              },
            },
            {
              type: 'time-lag',
              settings: {
                title: '互换起始日',
                dataIndex: 'startDay',
                addonBefore: 'T +',
              },
            },
            {
              type: 'radio',
              settings: {
                title: 'radio',
                dataIndex: 'radio',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
              },
            },
            {
              type: 'money',
              settings: {
                title: '合约编号',
                dataIndex: 'contractCode',
                rules: [
                  {
                    required: true,
                  },
                ],
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
              },
            },
            {
              type: 'percent',
              settings: {
                title: '交易簿',
                dataIndex: 'bookName',
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
                    title: '合约编号',
                    dataIndex: 'contractCode',
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
                    title: '交易簿',
                    dataIndex: 'bookName',
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
                    },
                  },
                },
              ],
            },
            {
              type: 'editable-table',
              settings: {
                labelCol: {
                  span: 0,
                },
                wrapperCol: {
                  span: 24,
                },
                addable: {},
                fieldItems: [
                  {
                    type: 'select',
                    settings: ({ rowId }) => ({
                      title: 'select',
                      dataIndex: 'select',
                      rules: [
                        {
                          required: true,
                        },
                        ({ getFieldValue, getFieldsValue }) => ({
                          validator(rule, val?: string) {
                            if (val == null) {
                              return Promise.resolve();
                            }

                            const currentSelectVal = getFieldValue([rowId!, 'select']);

                            const tableValues = getFieldsValue();

                            const otherSelectValues = utlFp.flow(
                              utlFp.omit([rowId!]),
                              utlFp.mapValues((rowData: RecordType) => rowData.select),
                              utlFp.values,
                              /** 过滤空值 */
                              utlFp.filter(Boolean),
                            )(tableValues);

                            if (otherSelectValues.includes(currentSelectVal)) {
                              return Promise.reject(new Error('不能有重复的选项'));
                            }

                            return Promise.resolve();
                          },
                        }),
                      ],
                      valueEnums: {
                        a: 'A',
                        b: 'B',
                        c: 'C',
                      },
                      editable: true,
                    }),
                  },
                  {
                    type: 'text',
                    settings: {
                      dataIndex: 'text',
                      title: 'text',
                      editable: true,
                      autoFocus: true,
                    },
                  },
                  {
                    type: 'date',
                    settings: {
                      title: 'date',
                      dataIndex: 'date',
                      editable: true,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: 'digit',
                      dataIndex: 'digit',
                      editable: true,
                    },
                  },
                ],
              },
            },
            {
              type: 'text',
              settings: {
                title: '表单必填样式单独控制',
                dataIndex: 'requiredStyle',
                required: true,
                colSpan: 6,
                linkagetip: ['通过required参数控制：true或false'],
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

/**
 * debug: true
 * desc: 嵌套表单中的编辑表格，单元格提示信息关闭会再次出现
 */
import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Divider, Space } from 'antd';
import delay from 'delay';
import React, { useRef, useState } from 'react';

export default () => {
  const [data, setData] = useState<RecordType>();
  const [vdata, setVdata] = useState<RecordType>();
  const formRef = useRef<OSFormAPI>(null);
  return (
    <OSProviderWrapper>
      <Space>
        <OSTrigger
          type="button"
          settings={{
            text: 'validate',
          }}
          onClick={async () => {
            const rsp = await formRef.current?.validate();
            setVdata(rsp?.data.values);
          }}
        />
        <OSTrigger
          type="button"
          settings={{
            text: 'reset',
          }}
          onClick={async () => {
            formRef.current?.resetFields();
            setData({});
            setVdata({});
          }}
        />
      </Space>
      <OSForm
        onChange={(values) => {
          setData(values);
        }}
        ref={formRef}
        settings={{
          fieldItems: [
            {
              type: 'layout-modal-form',
              settings: {
                title: 'layout-modal-form',
                dataIndex: 'layoutModalForm',
                buttonTriggerText: '按钮1',
                modalDialogSettings: {
                  width: '80%',
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
                        width: '80%',
                        title: '标题',
                      },
                      formFieldItems: [
                        {
                          type: 'editable-table',
                          settings: {
                            title: 'editable-table',
                            dataIndex: 'editableTable',
                            addable: {},
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
                              {
                                type: 'money',
                                settings: {
                                  title: 'money',
                                  dataIndex: 'money',
                                },
                              },
                            ],
                          },
                        },
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
              type: 'editable-table',
              settings: {
                title: 'editable-table',
                dataIndex: 'editableTable',
                addable: {
                  addTriggerSettings: {
                    id: 't_add_row',
                  },
                },
                fieldItems: [
                  {
                    type: 'money',
                    settings: {
                      title: 'asyncValidate',
                      dataIndex: 'asyncValidate',
                      id: 't_cell_money',
                      formItemId: 't_form_item_money',
                      rules: [
                        { required: true },
                        {
                          validator: async (_, val) => {
                            await delay(1000);
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
                                  await delay(1000);
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
                    type: 'digit',
                    settings: {
                      title: 'linkageValue',
                      dataIndex: 'linkageValue',

                      id: 't_cell_digit',
                    },
                  },
                ],
              },
            },
            {
              type: 'editable-table',
              settings: {
                title: 'editable-table-changeDebounceTimestamp',
                dataIndex: 'editableTable-changeDebounceTimestamp',
                addable: {
                  addTriggerSettings: {
                    id: 't_add_row',
                  },
                },
                fieldItems: [
                  {
                    type: 'money',
                    settings: {
                      title: 'asyncValidate',
                      dataIndex: 'asyncValidate',
                      id: 't_cell_money',
                      formItemId: 't_form_item_money',
                      rules: [
                        { required: true },
                        {
                          validator: async (_, val) => {
                            await delay(1000);
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
                                  await delay(1000);
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
                    type: 'digit',
                    settings: {
                      title: 'linkageValue',
                      dataIndex: 'linkageValue',

                      id: 't_cell_digit',
                    },
                  },
                ],
              },
            },
          ],
        }}
      ></OSForm>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(vdata, null, 2)}</pre>
      <Divider />
      <OSForm
        settings={{
          fieldItems: [
            {
              type: 'digit',
              settings: {
                title: 'linkageValue',
                dataIndex: 'linkageValue',
                inlineError: true,
                rules: [
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
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

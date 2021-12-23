import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Divider, Space, Typography } from '@ty/antd';
import delay from 'delay';
import React, { useRef, useState } from 'react';

export default () => {
  const [data, setData] = useState<RecordType>();
  const [vdata, setVdata] = useState<RecordType>();
  const formRef = useRef<OSFormAPI>(null);
  return (
    <OSProviderWrapper>
      <Typography.Paragraph>
        layout-modal-form 和 editable-table
        这两种典型的表单字段相互嵌套，当字段验证不通过的时候（包括异步验证）将上报所有嵌套的表单
      </Typography.Paragraph>
      <Divider />
      <div>
        <Space>
          <OSTrigger
            type="button"
            settings={{
              text: 'validate',
            }}
            onClick={async () => {
              const rsp = await formRef.current?.validate();
              setVdata(rsp?.data.values);
              alert(JSON.stringify(rsp));
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
      </div>
      <Space>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <pre>{JSON.stringify(vdata, null, 2)}</pre>
        <OSForm
          onChange={(values) => {
            setData(values);
          }}
          ref={formRef}
          settings={{
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
                    {
                      type: 'editable-table',
                      settings: {
                        title: 'editable-table-rich',
                        dataIndex: 'editableTableRich',
                        addable: {},
                        changedValueHasMeta: true,
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
                            type: 'digit',
                            settings: {
                              title: 'linkageValue',
                              dataIndex: 'linkageValue',
                              disabled: true,
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
                        disabled: true,
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
                        disabled: true,
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
                  disabled: true,
                },
              },
              {
                type: 'editable-table',
                settings: {
                  title: 'editable-table-rich',
                  dataIndex: 'editableTableRich',
                  addable: {},
                  changedValueHasMeta: true,
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
                      type: 'digit',
                      settings: {
                        title: 'linkageValue',
                        dataIndex: 'linkageValue',
                        disabled: true,
                      },
                    },
                  ],
                },
              },
              {
                type: 'layout-tabs-form',
                settings: {
                  title: 'layout-tabs-form',
                  dataIndex: 'layout-tabs-form',
                  collapsable: true,
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
                        fieldItems: [
                          {
                            type: 'money',
                            settings: {
                              title: 'tab1-money',
                              dataIndex: 'money',
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
                            type: 'date',
                            settings: {
                              title: 'tab1-date',
                              dataIndex: 'date',
                              rules: [{ required: true }],
                            },
                          },
                        ],
                      },
                    },
                    tab2: {
                      settings: {
                        fieldItems: [
                          {
                            type: 'money',
                            settings: {
                              title: 'tab2-money',
                              dataIndex: 'money',
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
                            type: 'date',
                            settings: {
                              title: 'tab2-date',
                              dataIndex: 'date',
                              rules: [{ required: true }],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
              {
                type: 'form',
                settings: {
                  dataIndex: 'form',
                  title: 'form',
                  fieldItemSettings: {
                    labelCol: { span: 6 },
                  },
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
                      type: 'date',
                      settings: {
                        title: 'date',
                        dataIndex: 'date',
                        rules: [{ required: true }],
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
                              ],
                            },
                          },
                          {
                            type: 'digit',
                            settings: {
                              title: 'linkageValue',
                              dataIndex: 'linkageValue',
                              disabled: true,
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
                        disabled: true,
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
                              disabled: true,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            valueLinkage: [
              (changedValues) => {
                if ('asyncValidate' in changedValues) {
                  return {
                    linkageValue: changedValues.asyncValidate * 10,
                  };
                }
                return {};
              },
              (changedValues) => {
                if ('form' in changedValues) {
                  return {
                    form: {
                      ...changedValues.form,
                      linkageValue: changedValues.form.asyncValidate * 10,
                    },
                  };
                }
                return {};
              },
            ],
            valueAsyncLinkage: {
              serial: [
                async (changedValues) => {
                  if ('editableTable' in changedValues) {
                    return {
                      editableTable: changedValues.editableTable.map((item: RecordType) => ({
                        /** 注意返回 item */
                        ...item,
                        linkageValue: item.asyncValidate * 10,
                      })),
                    };
                  }
                  return {};
                },
                async (changedValues) => {
                  if ('editableTableRich' in changedValues) {
                    await delay(1000);
                    return {
                      editableTableRich: {
                        ...changedValues.editableTableRich,
                        target: changedValues.editableTableRich.target.map((item: RecordType) => ({
                          /** 注意返回 item */
                          ...item,
                          linkageValue: item.asyncValidate * 10,
                        })),
                      },
                    };
                  }
                  return {};
                },
                async (changedValues, values) => {
                  if ('layoutModalForm' in changedValues) {
                    await delay(1000);
                    return {
                      layoutModalForm: {
                        /** 注意返回 layoutModalForm */
                        ...changedValues.layoutModalForm,
                        linkageValue: values.layoutModalForm.asyncValidate * 10,
                      },
                    };
                  }
                  return {};
                },
              ],
            },
          }}
        ></OSForm>
      </Space>
    </OSProviderWrapper>
  );
};

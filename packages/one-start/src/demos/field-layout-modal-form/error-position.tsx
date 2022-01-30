import {
  OSDialog,
  OSEditableTable,
  OSForm,
  OSProviderWrapper,
  OSTrigger,
} from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSEditableTable
        settings={{
          fieldItems: [
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
          ],
          addable: {},
        }}
      />
      <OSForm
        settings={{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          fieldItems: [
            {
              type: 'editable-table',
              settings: {
                title: 'fieldItems',
                dataIndex: 'editable-table',
                fieldItems: [
                  {
                    type: 'digit',
                    settings: {
                      title: 'digit',
                      dataIndex: 'digit',
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    },
                  },
                ],
                addable: {},
              },
            },
            {
              type: 'layout-modal-form',
              settings: {
                title: 'layout-modal-form',
                dataIndex: 'layout-modal-form',
                buttonTriggerText: 'trigger',
                formSettings: {
                  fieldItems: [
                    {
                      type: 'editable-table',
                      settings: {
                        title: 'fieldItems',
                        dataIndex: 'editable-table',
                        fieldItems: [
                          {
                            type: 'digit',
                            settings: {
                              title: 'digit',
                              dataIndex: 'digit',
                              rules: [
                                {
                                  required: true,
                                },
                              ],
                            },
                          },
                        ],
                        addable: {},
                      },
                    },
                  ],
                },
              },
            },
          ],
        }}
      />

      <OSDialog
        type="drawer"
        destroyOnClose={false}
        settings={{
          title: '确认提示',
          width: '80%',
          body: (
            <>
              <OSEditableTable
                settings={{
                  fieldItems: [
                    {
                      type: 'digit',
                      settings: {
                        title: 'digit',
                        dataIndex: 'digit',
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      },
                    },
                  ],
                  addable: {},
                }}
              />
              <OSForm
                settings={{
                  labelCol: { span: 4 },
                  wrapperCol: { span: 20 },
                  fieldItems: [
                    {
                      type: 'editable-table',
                      settings: {
                        title: 'fieldItems',
                        dataIndex: 'editable-table',
                        fieldItems: [
                          {
                            type: 'digit',
                            settings: {
                              title: 'digit',
                              dataIndex: 'digit',
                              rules: [
                                {
                                  required: true,
                                },
                              ],
                            },
                          },
                        ],
                        addable: {},
                      },
                    },
                    {
                      type: 'layout-modal-form',
                      settings: {
                        title: 'layout-modal-form',
                        dataIndex: 'layout-modal-form',
                        buttonTriggerText: 'trigger',
                        formSettings: {
                          fieldItems: [
                            {
                              type: 'editable-table',
                              settings: {
                                title: 'fieldItems',
                                dataIndex: 'editable-table',
                                fieldItems: [
                                  {
                                    type: 'digit',
                                    settings: {
                                      title: 'digit',
                                      dataIndex: 'digit',
                                      rules: [
                                        {
                                          required: true,
                                        },
                                      ],
                                    },
                                  },
                                ],
                                addable: {},
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                }}
              />
            </>
          ),
        }}
      >
        <OSTrigger
          type="button"
          settings={{
            type: 'primary',
            text: '抽屉反馈',
          }}
        ></OSTrigger>
      </OSDialog>
    </OSProviderWrapper>
  );
};

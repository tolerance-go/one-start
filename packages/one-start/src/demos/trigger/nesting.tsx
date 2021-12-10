import type { OSDialogAPI } from '@ty-one-start/one-start';
import { OSDialog, OSForm, OSProviderWrapper, OSTable, OSTrigger } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import delay from 'delay';
import { mock } from 'mockjs';
import React, { useRef } from 'react';

export default () => {
  const actionsRef1 = useRef<OSDialogAPI>(null);
  const actionsRef2 = useRef<OSDialogAPI>(null);
  const actionsRef3 = useRef<OSDialogAPI>(null);

  return (
    <OSProviderWrapper>
      <Space>
        <OSDialog
          type="modal"
          ref={actionsRef1}
          settings={{
            body: (
              <OSDialog
                type="modal"
                ref={actionsRef2}
                settings={{
                  body: (
                    <OSDialog
                      type="modal"
                      ref={actionsRef3}
                      settings={{
                        body: (
                          <OSTrigger
                            type="button"
                            settings={{
                              text: '关闭所有',
                            }}
                            onClick={() => {
                              actionsRef3.current?.pop();
                              actionsRef2.current?.pop();
                              actionsRef1.current?.pop();
                            }}
                          ></OSTrigger>
                        ),
                      }}
                    >
                      <OSTrigger
                        type="button"
                        settings={{
                          text: 'btn3',
                        }}
                      />
                    </OSDialog>
                  ),
                }}
              >
                <OSTrigger
                  type="button"
                  settings={{
                    text: 'btn2',
                  }}
                />
              </OSDialog>
            ),
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: '多层嵌套',
            }}
          />
        </OSDialog>
        <OSDialog
          type="modal"
          settings={{
            body: (
              <OSDialog
                type="modal"
                settings={{
                  body: (
                    <OSTable
                      settings={{
                        fieldItems: [
                          {
                            type: 'text',
                            settings: {
                              title: 'name',
                              dataIndex: 'name',
                            },
                          },
                          {
                            type: 'actions',
                            settings: () => {
                              const actionRef = React.createRef<OSDialogAPI>();
                              return {
                                title: '操作',
                                dataIndex: 'actions',
                                actions: [
                                  <OSDialog
                                    type="modal"
                                    ref={actionRef}
                                    settings={{
                                      body: (
                                        <OSForm
                                          settings={{
                                            fieldItems: [
                                              {
                                                type: 'text',
                                                settings: {
                                                  title: 'name',
                                                  dataIndex: 'name',
                                                },
                                              },
                                            ],
                                          }}
                                          requests={{
                                            requestDataSource: async () => {
                                              await delay(1000);
                                              return {
                                                error: false,
                                                data: {
                                                  name: '123',
                                                },
                                              };
                                            },
                                          }}
                                        ></OSForm>
                                      ),
                                      footer: (
                                        <OSTrigger
                                          type="button"
                                          settings={{
                                            text: '保存',
                                          }}
                                          requests={{
                                            requestAfterClick: async () => {
                                              await delay(1000);
                                              actionRef.current?.pop();
                                            },
                                          }}
                                        ></OSTrigger>
                                      ),
                                    }}
                                  >
                                    <OSTrigger
                                      type="button"
                                      settings={{
                                        type: 'link',
                                        text: '编辑',
                                      }}
                                    ></OSTrigger>
                                  </OSDialog>,
                                ],
                              };
                            },
                          },
                        ],
                      }}
                      requests={{
                        requestDataSource: async () => {
                          return mock({
                            error: false,
                            data: {
                              'page|40': [
                                {
                                  id: '@id',
                                  name: '@cname',
                                },
                              ],
                              total: 40,
                            },
                          });
                        },
                      }}
                    ></OSTable>
                  ),
                }}
              >
                <OSTrigger
                  type="button"
                  settings={{
                    text: '继续弹出表格',
                  }}
                ></OSTrigger>
              </OSDialog>
            ),
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: '嵌套表格操作',
            }}
          />
        </OSDialog>
      </Space>
    </OSProviderWrapper>
  );
};

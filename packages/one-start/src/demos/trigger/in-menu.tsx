import { OSProviderWrapper, OSTrigger, OSDialog } from '@ty-one-start/one-start';
import { Space } from 'antd';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSTrigger
          type="dropdown"
          settings={{
            text: '按钮1',
            tooltip: 'tooltip',
            overlayZIndex: 950,
            menu: [
              {
                disabled: true,
                text: (
                  <OSTrigger
                    type="dropdown"
                    settings={{
                      plain: true,
                      block: true,
                      text: 'menu1',
                      tooltip: 'tooltip',
                      menu: [
                        {
                          disabled: true,
                          text: (
                            <OSTrigger
                              type="dropdown"
                              settings={{
                                plain: true,
                                text: 'menu1',
                                tooltip: 'tooltip',
                                menu: [
                                  {
                                    text: 'menu1',
                                  },
                                ],
                              }}
                              requests={{
                                requestAfterClick: async () => {
                                  await delay(1000);
                                },
                                requestAfterMenuClick: async () => {
                                  await delay(1000);
                                },
                              }}
                            ></OSTrigger>
                          ),
                        },
                      ],
                    }}
                    requests={{
                      requestAfterClick: async () => {
                        await delay(1000);
                      },
                      requestAfterMenuClick: async () => {
                        await delay(1000);
                      },
                    }}
                  ></OSTrigger>
                ),
              },
              {
                disabled: true,
                text: (
                  <OSTrigger
                    type="button"
                    settings={{
                      text: '按钮1',
                      plain: true,
                      tooltip: 'tooltip',
                      block: true,
                    }}
                    requests={{
                      requestAfterClick: async () => {
                        await delay(1000);
                      },
                    }}
                  ></OSTrigger>
                ),
              },
              {
                disabled: true,
                text: (
                  <OSTrigger
                    type="button"
                    settings={{
                      text: '同步更新',
                      tooltip: 'tooltip',
                      plain: true,
                      block: true,
                    }}
                    requests={{
                      requestAfterSync: async () => {
                        await delay(1000);
                      },
                    }}
                  ></OSTrigger>
                ),
              },
              {
                text: 'menu4',
                type: 'sub-menu',
                children: [
                  {
                    text: 'menu4-1',
                  },
                  {
                    text: 'menu4-2',
                  },
                ],
              },
              {
                text: 'menu5',
                type: 'item-group',
                children: [
                  {
                    text: 'menu5-1',
                    key: 'item-group-1',
                  },
                  {
                    text: 'menu5-2',
                    key: 'item-group-2',
                  },
                ],
              },
              {
                text: (
                  <OSDialog
                    type="modal-operation"
                    settings={{
                      title: '确认标题',
                      width: 1000,
                      content: (
                        <div
                          style={{
                            width: '100%',
                            height: 800,
                            background: '#ccc',
                          }}
                        ></div>
                      ),
                    }}
                    requests={{
                      requestAfterCancel: async () => {
                        await delay(1000);
                        return {
                          error: false,
                        };
                      },
                      requestAfterConfirm: async () => {
                        await delay(1000);
                        return {
                          error: false,
                        };
                      },
                    }}
                  >
                    <OSTrigger
                      type="button"
                      settings={{
                        type: 'text',
                        plain: true,
                        block: true,
                        text: 'menu6-with-dialog',
                      }}
                    ></OSTrigger>
                  </OSDialog>
                ),
              },
            ],
          }}
          requests={{
            requestAfterClick: async () => {
              await delay(1000);
            },
            requestAfterMenuClick: async () => {
              await delay(1000);
            },
          }}
        ></OSTrigger>
      </Space>
    </OSProviderWrapper>
  );
};

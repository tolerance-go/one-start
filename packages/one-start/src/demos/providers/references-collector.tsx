import {
  OSDialog,
  OSForm,
  OSProviderWrapper,
  OSReferencesCollectorProviderWrapper,
  OSTable,
  OSTrigger,
  useRefsRef,
} from '@ty-one-start/one-start';
import { Space } from 'antd';
import delay from 'delay';
import Mock from 'mockjs';
import React from 'react';

export default () => {
  const { refKeys, refsRef } = useRefsRef({
    dialogs: {
      modals: {
        modalKey: 'modalKey',
      },
      popconfirms: {
        popconfirmKey: 'popconfirmKey',
      },
    },
    tables: {
      tableKey: 'tableKey',
    },
    forms: {
      formKey: 'formKey',
    },
    triggers: {
      buttons: {
        buttonKey: 'buttonKey',
      },
      dropdowns: {
        dropdownsKey: 'dropdownsKey',
      },
    },
  });

  return (
    <OSProviderWrapper>
      <OSReferencesCollectorProviderWrapper ref={refsRef}>
        <Space style={{ marginBottom: 10 }}>
          <OSDialog
            refKey={refKeys.dialogs.modals.modalKey}
            type="modal"
            settings={{
              title: '标题',
              body: <div style={{ background: '#ccc', height: 30 }}></div>,
            }}
          >
            <OSTrigger
              refKey={refKeys.triggers.buttons.buttonKey}
              type="button"
              settings={{
                text: '弹出拟态框',
              }}
            ></OSTrigger>
          </OSDialog>
          <OSTrigger
            refKey={refKeys.triggers.dropdowns.dropdownsKey}
            type="dropdown"
            settings={{
              text: '下拉按钮',
              menu: [
                {
                  text: 'menu1',
                },
                {
                  text: 'menu2',
                },
                {
                  text: 'menu3',
                },
              ],
            }}
          ></OSTrigger>
          <OSDialog
            refKey={refKeys.dialogs.popconfirms.popconfirmKey}
            type="popconfirm"
            settings={{
              title: '确认标题',
            }}
          >
            <OSTrigger
              type="button"
              settings={{
                text: '触发弹出',
              }}
            ></OSTrigger>
          </OSDialog>
        </Space>
        <OSTable
          refKey={refKeys.tables.tableKey}
          settings={{
            fieldItems: [
              {
                type: 'digit',
                settings: {
                  title: 'digit',
                  dataIndex: 'digit',
                },
              },
              {
                type: 'money',
                settings: {
                  title: 'money',
                  dataIndex: 'money',
                },
              },
              {
                type: 'percent',
                settings: {
                  title: 'percent',
                  dataIndex: 'percent',
                },
              },
            ],
          }}
          requests={{
            requestDataSource: async (options) => {
              console.log(options);

              await delay(1000);

              return Mock.mock({
                error: false,
                data: {
                  'page|20': [
                    {
                      id: '@id',
                      money: '@integer',
                      percent: '@integer',
                      digit: '@integer',
                    },
                  ],
                  total: 20,
                },
              });
            },
          }}
        ></OSTable>
        <OSForm
          refKey={refKeys.forms.formKey}
          settings={{
            fieldItems: [
              {
                type: 'money',
                settings: {
                  title: 'a',
                  dataIndex: 'a',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                },
              },
              {
                type: 'money',
                settings: {
                  title: 'b',
                  dataIndex: 'b',
                },
              },
              {
                type: 'money',
                settings: {
                  title: 'c',
                  dataIndex: 'c',
                },
              },
              {
                type: 'money',
                settings: {
                  title: 'd',
                  dataIndex: 'd',
                },
              },
              {
                type: 'actions',
                settings: {
                  actions: [
                    <OSTrigger
                      type="button"
                      settings={{
                        text: '验证',
                      }}
                      onClick={async () => {
                        await refsRef.current?.forms?.formKey?.validate();
                      }}
                    />,
                  ],
                },
              },
            ],
          }}
        ></OSForm>
      </OSReferencesCollectorProviderWrapper>
    </OSProviderWrapper>
  );
};

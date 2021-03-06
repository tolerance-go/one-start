/**
 * iframe: 1000
 */
import type { OSTableFormFieldItems } from '@ty-one-start/one-start';
import {
  OSDialog,
  OSPage,
  OSProviderWrapper,
  OSSearchTable,
  OSTrigger,
} from '@ty-one-start/one-start';
import delay from 'delay';
import Mock, { mock, Random } from 'mockjs';
import moment from 'moment';
import React from 'react';
import { useDemoSettings } from '../hooks/use-demo-settings';

const normalFieldItems: OSTableFormFieldItems = [
  {
    type: 'text',
    settings: {
      title: 'text',
      dataIndex: 'text',
      search: true,
      fixed: 'left',
    },
  },
  {
    type: 'date-range',
    settings: {
      title: 'date-range',
      dataIndex: 'date-range',
      search: true,
    },
  },
  {
    type: 'date',
    settings: {
      title: 'date',
      dataIndex: 'date',
      search: true,
    },
  },

  {
    type: 'select',
    settings: {
      mode: 'multiple',
      title: 'select',
      dataIndex: 'select',
      showSearch: true,
      search: true,
    },
    requests: {
      requestOptions: async () => {
        return mock({
          error: false,
          'data|1-50': [
            {
              label: () => Random.id(),
              value() {
                return this.label;
              },
            },
          ],
        });
      },
    },
  },
  {
    type: 'money',
    settings: {
      title: 'money',
      dataIndex: 'money',
      search: true,
    },
  },

  {
    type: 'digit',
    settings: {
      title: 'digit',
      dataIndex: 'digit',
      search: true,
    },
  },

  {
    type: 'percent',
    settings: {
      title: 'percent',
      dataIndex: 'percent',
      search: true,
    },
  },
  {
    type: 'text',
    settings: {
      title: 'text2',
      dataIndex: 'text2',
      search: true,
    },
  },
  {
    type: 'switch',
    settings: {
      title: 'switch',
      dataIndex: 'switch',
      search: true,
    },
  },
  {
    type: 'text',
    settings: {
      title: 'text3',
      dataIndex: 'text3',
      search: true,
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
      search: true,
    },
  },
  {
    type: 'text',
    settings: {
      title: 'text4',
      dataIndex: 'text4',
      search: true,
    },
  },
  {
    type: 'text',
    settings: {
      title: 'text5',
      dataIndex: 'text5',
      search: true,
    },
  },
];

const lightFieldItems = normalFieldItems.map((item, index) => ({
  ...item,
  settings: {
    ...item.settings,
    search: index < 1,
  },
})) as OSTableFormFieldItems;

export default () => {
  const { settingForm, settings } = useDemoSettings({
    fieldItems: [
      {
        type: 'switch',
        settings: {
          dataIndex: 'enableLightSearch',
          title: '???????????????',
        },
      },
    ],
    initialSettings: {
      enableLightSearch: false,
    },
  });

  return (
    <OSProviderWrapper>
      {settingForm}
      <div
        style={{
          padding: '10px 20px',
        }}
      >
        <OSPage
          settings={{
            title: '????????????',
            breadcrumb: [
              {
                path: '',
                name: '????????????',
              },
            ],
            tabs: [
              {
                title: 'Tab1',
                key: 'tab1',
              },
              {
                title: 'Tab2',
                key: 'tab2',
              },
              {
                title: 'Tab3',
                key: 'tab3',
              },
            ],
            content: {
              tab1: (
                <OSSearchTable
                  settings={{
                    searchFormSettings: {
                      labelCol: {
                        span: 6,
                      },
                      wrapperCol: {
                        span: 18,
                      },
                    },
                    batchOperation: ({ selectedRowKeys }) => {
                      return [
                        <OSDialog
                          type="popconfirm"
                          settings={{
                            title: '???????????????????',
                          }}
                        >
                          <OSTrigger
                            type="button"
                            settings={{
                              text: '????????????1',
                              type: 'primary',
                              disabled: !selectedRowKeys.length,
                            }}
                          />
                        </OSDialog>,
                        <OSTrigger
                          type="dropdown"
                          settings={{
                            text: '????????????2',
                            type: 'primary',
                            menu: [
                              {
                                type: 'item',
                                text: '?????????1',
                              },
                              {
                                type: 'item',
                                text: '?????????2',
                              },
                            ],
                          }}
                        />,
                      ];
                    },
                    actions: [
                      <OSTrigger
                        type="button"
                        settings={{
                          text: '????????????',
                        }}
                      />,
                      <OSTrigger
                        type="button"
                        settings={{
                          type: 'primary',
                          text: '?????????1',
                        }}
                      />,
                      <OSTrigger
                        type="button"
                        settings={{
                          type: 'primary',
                          text: '?????????2',
                        }}
                      />,
                      <OSTrigger
                        type="button"
                        settings={{
                          type: 'primary',
                          text: '?????????3',
                        }}
                      />,
                    ],
                    searchTempldateable: {
                      templateNameKey: 'templateName',
                      templateManagementTableFieldItems: [
                        {
                          type: 'text',
                          settings: {
                            title: '????????????',
                            dataIndex: 'templateName',
                            search: true,
                          },
                        },
                        {
                          type: 'select',
                          settings: {
                            title: '????????????',
                            dataIndex: 'templateType',
                            valueEnums: {
                              PERSONAL: '??????',
                              PUBLIC: '??????',
                            },
                          },
                        },
                        {
                          type: 'date',
                          settings: {
                            title: '??????????????????',
                            dataIndex: 'updateTime',
                            format: 'YYYY-MM-DD HH:mm:ss',
                          },
                        },
                      ],
                      createFormFieldItems: [
                        {
                          type: 'text',
                          settings: {
                            title: '????????????',
                            dataIndex: 'templateName',
                          },
                        },
                        {
                          type: 'select',
                          settings: {
                            title: '????????????',
                            dataIndex: 'templateType',
                            valueEnums: {
                              PERSONAL: '??????',
                              PUBLIC: '??????',
                            },
                            initialValue: 'PERSONAL',
                          },
                        },
                      ],
                      editFormFieldItems: [
                        {
                          type: 'text',
                          settings: {
                            title: '????????????',
                            dataIndex: 'templateName',
                          },
                        },
                        {
                          type: 'select',
                          settings: {
                            title: '????????????',
                            dataIndex: 'templateType',
                            valueEnums: {
                              PERSONAL: '??????',
                              PUBLIC: '??????',
                            },
                          },
                        },
                      ],
                    },
                    fieldItems: settings.enableLightSearch ? lightFieldItems : normalFieldItems,
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
                              date: () => Random.date(),
                              'date-range': () => {
                                const item = moment(Random.date());
                                return [item, item.clone().subtract(30, 'd')];
                              },
                              select: () => Random.word(),
                              money: () => Random.integer(),
                              text: () => Random.word(),
                              digit: () => Random.integer(),
                              switch: () => Random.boolean(),
                              radio: () => Random.pick(['a', 'b', 'c']),
                              percent: () => Random.integer(),
                              text2: () => Random.word(),
                              text3: () => Random.word(),
                              text4: () => Random.word(),
                            },
                          ],
                          total: 20,
                        },
                      });
                    },

                    requestCreateTemplate: async (options) => {
                      console.log(options);
                      await delay(1000);
                      return mock({
                        error: false,
                        data: {
                          tplId: '@id',
                          tplName: options.values?.templateName,
                        },
                      });
                    },
                    requestTemplateDataSource: async (options) => {
                      console.log(options);
                      await delay(1000);
                      return Mock.mock({
                        error: false,
                        data: {
                          'page|20': [
                            {
                              id: '@id',
                              templateName: () => Random.word(),
                              templateType: () => Random.word(),
                              updateTime: () => Random.datetime(),
                            },
                          ],
                          total: 20,
                        },
                      });
                    },
                    requestApplayTemplateSearchValues: async (options) => {
                      console.log('options', options);
                      await delay(1000);
                      return mock({
                        error: false,
                        data: {
                          searchDataSource: {
                            date: () => Random.date(),
                            'date-range': () => {
                              const item = moment(Random.date());
                              return [item, item.clone().subtract(30, 'd')];
                            },
                            select: () => Random.word(),
                            money: () => Random.integer(),
                            text: () => Random.word(),
                            digit: () => Random.integer(),
                            switch: () => Random.boolean(),
                            radio: () => Random.pick(['a', 'b', 'c']),
                            percent: () => Random.integer(),
                            text2: () => Random.word(),
                            text3: () => Random.word(),
                            text4: () => Random.word(),
                          },
                          columnsVisibleMap: {},
                          columnsFixedsMap: {},
                          columnsOrders: {},
                        },
                      });
                    },
                    requestUpdateSearchTempldate: async (options) => {
                      console.log('options', options);
                      await delay(1000);
                      return {
                        error: false,
                      };
                    },
                  }}
                ></OSSearchTable>
              ),
            },
          }}
        />
      </div>
    </OSProviderWrapper>
  );
};

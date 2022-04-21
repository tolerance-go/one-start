/**
 * transform: true
 * iframe: 650
 */
import type {
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSTableRequestDataSourceParams,
} from '@ty-one-start/one-start';
import { OSProviderWrapper, OSSearchTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock, { mock, Random } from 'mockjs';
import React from 'react';

export default (props: {
  onRequestDataSource?: (
    options: OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  ) => void;
}) => {
  return (
    <OSProviderWrapper>
      <OSSearchTable
        settings={{
          searchTempldateable: {
            templateNameKey: 'templateName',
            templateManagementTableFieldItems: [
              {
                type: 'text',
                settings: {
                  title: '模板名称',
                  dataIndex: 'templateName',
                },
              },
              {
                type: 'select',
                settings: {
                  title: '模板类型',
                  dataIndex: 'templateType',
                  valueEnums: {
                    PERSONAL: '个人',
                    PUBLIC: '公共',
                  },
                },
              },
              {
                type: 'date',
                settings: {
                  title: '最近保存时间',
                  dataIndex: 'updateTime',
                  format: 'YYYY-MM-DD HH:mm:ss',
                },
              },
            ],
            createFormFieldItems: [
              {
                type: 'text',
                settings: {
                  title: '模板名称',
                  dataIndex: 'templateName',
                },
              },
              {
                type: 'select',
                settings: {
                  title: '模板类型',
                  dataIndex: 'templateType',
                  valueEnums: {
                    PERSONAL: '个人',
                    PUBLIC: '公共',
                  },
                  initialValue: 'PERSONAL',
                },
              },
            ],
            editFormFieldItems: [
              {
                type: 'text',
                settings: {
                  title: '模板名称',
                  dataIndex: 'templateName',
                },
              },
              {
                type: 'select',
                settings: {
                  title: '模板类型',
                  dataIndex: 'templateType',
                  valueEnums: {
                    PERSONAL: '个人',
                    PUBLIC: '公共',
                  },
                },
              },
            ],
          },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                search: true,
                sorter: true,
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
                title: 'text',
                dataIndex: 'text',
                search: true,
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
                search: true,
              },
            },
            {
              type: 'group',
              settings: {
                title: '分组1',
              },
              children: [
                {
                  type: 'digit',
                  settings: {
                    title: 'digit',
                    dataIndex: 'digit',
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
                  type: 'date-range',
                  settings: {
                    title: 'date-range',
                    dataIndex: 'date-range',
                    search: true,
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
                    search: true,
                  },
                },
                {
                  type: 'textarea',
                  settings: {
                    title: 'textarea',
                    dataIndex: 'textarea',
                    search: true,
                    ellipsis: true,
                  },
                },
                {
                  type: 'select',
                  settings: {
                    title: 'select-search',
                    dataIndex: 'select-search',
                    showSearch: true,
                    mode: 'multiple',
                    search: true,
                  },
                  requests: {
                    requestOptions: async () => {
                      return Promise.resolve({
                        error: false,
                        data: [
                          { value: 'a', label: 'A' },
                          { value: 'b', label: 'B' },
                          { value: 'c', label: 'C' },
                        ],
                      });
                    },
                  },
                },
              ],
            },
          ],
        }}
        requests={{
          requestDataSource: async (options) => {
            props.onRequestDataSource?.(options);
            await delay(1000);

            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    money: () => Random.integer(),
                    percent: () => Random.integer(),
                    text: () => Random.word(),
                    textarea: () => Random.paragraph(),
                    digit: () => Random.integer(),
                    date: () => Random.date(),
                    'date-range': () => [Random.date(), Random.date()],
                    select: () => Random.pick(['a', 'b', 'c']),
                    'select-search': () => Random.pick(['a', 'b', 'c']),
                  },
                ],
                total: 100,
              },
            });
          },
          requestCreateTemplate: async (options) => {
            await delay(1000);

            return mock({
              error: false,
              data: {
                tplId: '@id',
                tplName: options.values?.templateName,
              },
            });
          },
          requestTemplateDataSource: async () => {
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
          requestApplayTemplateSearchValues: async () => {
            await delay(1000);

            return {
              error: false,
              data: {
                searchDataSource: {
                  money: -279017462758012,
                  percent: -5717274175563392,
                  text: 'nhlhym',
                },
                columnsVisibleMap: {
                  money: false,
                },
                columnsFixedsMap: {
                  text: true,
                  digit: true,
                },
                columnsOrders: {
                  textarea: 1,
                  text: 2,
                  money: 3,
                  percent: 4,
                  分组1: {
                    order: 0,
                    children: {
                      select: 0,
                      'date-range': 1,
                      digit: 2,
                      date: 3,
                    },
                  },
                },
              },
            };
          },
          requestUpdateSearchTempldate: async () => {
            await delay(1000);
            return {
              error: false,
            };
          },
        }}
      ></OSSearchTable>
    </OSProviderWrapper>
  );
};

/* eslint-disable no-param-reassign */
/**
 * transform: true
 * iframe: 700
 */
import type {
  OSTableFormFieldItemExtra,
  OSTableType,
  RequiredRecursion,
} from '@ty-one-start/one-start';
import {
  OSDialog,
  OSForm,
  OSProviderWrapper,
  OSTable,
  OSTrigger,
  unstateHistory,
} from '@ty-one-start/one-start';
import { Divider } from '@ty/antd';
import delay from 'delay';
import produce from 'immer';
import Mock, { Random } from 'mockjs';
import moment from 'moment';
import React, { useState } from 'react';

export default () => {
  const [key, setKey] = useState('');
  const [settings, setSettings] = useState({
    leftSideSearchForm: false,
    searchFormItemChunkSize: 3,
    searchFormSettingsLabelColSpan: 4,
    searchFormSettingsWrapperColSpan: 20,
    gutter: 10,
    labelAlign: 'right',
    readonly: false,
    colSpan: 8,
    syncURLParams: true,
  });

  const fieldItems: Required<OSTableType>['settings']['fieldItems'] = [
    {
      type: 'money',
      settings: {
        title: 'money',
        dataIndex: 'money',
        rules: [
          {
            required: true,
          },
        ],
        search: true,
        sorter: true,
        id: 't_money',
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
      type: 'date-range',
      settings: {
        title: 'field:only-in-search',
        dataIndex: 'field',
        search: 'only',
        initialValue: [moment().subtract(7, 'd'), moment()],
      },
    },
    {
      type: 'text',
      settings: {
        title: 'field:only-in-table',
        dataIndex: 'field',
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
            rules: [
              {
                required: true,
              },
            ],
          },
        },
        {
          type: 'date',
          settings: {
            title: 'date',
            dataIndex: 'date',
            search: true,
            id: 't_date',
            formItemId: 't_formItem_date',
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
            search: true,
            title: 'select',
            dataIndex: 'select',
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
            className: 't_select',
            dropdownClassName: 't_select_dropdown',
          },
        },
        {
          type: 'select',
          dependencies: ['select'],
          settings: ({ form }) => ({
            hide: !(form.getFieldValue('select') && form.getFieldValue('select') === 'a'),
            search: true,
            title: 'select-search',
            dataIndex: 'select-search',
            showSearch: true,
            mode: 'multiple',
            formItemId: 't_select_search',
          }),
          requests: {
            requestOptions: async () => {
              await delay(1000);
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
        {
          type: 'layout-modal-form',
          settings: {
            title: '自定义字段',
            search: 'only',
            dataIndex: 'customize',
            buttonTriggerText: '自定义字段搜索表单',
            modalDialogSettings: {
              title: '自定义字段搜索表单',
              width: 800,
            },
            formSettings: {
              labelCol: { span: 9 },
              wrapperCol: { span: 15 },
            },
            hideEmpty: false,
          },
          requests: {
            requestFieldItems: async () => {
              return {
                error: false,
                data: {
                  fieldItems: [
                    {
                      type: 'group',
                      settings: {
                        key: `customize-search-group`,
                      },
                      children: [
                        {
                          type: 'date',
                          settings: {
                            dataIndex: 'customizeDate',
                            title: 'customizeDate',
                            colSpan: 12,
                          },
                        },
                      ],
                    },
                  ],
                },
              };
            },
          },
        },
      ],
    },
  ];

  return (
    <OSProviderWrapper>
      <OSForm
        onValuesChange={(_, values_) => {
          setSettings(values_);
        }}
        settings={{
          size: 'small',
          layout: 'inline',
          initialValues: settings,
          fieldItems: [
            {
              type: 'switch',
              settings: {
                dataIndex: 'syncURLParams',
                title: 'syncURLParams',
              },
            },
            {
              type: 'custom',
              settings: {
                dataIndex: 'setURLParams',
                title: 'setURLParams',
                element: (
                  <span>
                    <OSTrigger
                      type="button"
                      settings={{
                        text: '设置URL参数',
                        id: 'setURLParamsBtn',
                      }}
                      onClick={() => {
                        unstateHistory.push({
                          pathname: window.location.pathname,
                          query: {
                            searchValues: {
                              money: 200,
                              date: '2022-02-02',
                            },
                            tableKey: 'search-form',
                          },
                        });
                        setKey(Random.id());
                      }}
                    />
                  </span>
                ),
              },
            },
            {
              type: 'switch',
              settings: {
                dataIndex: 'leftSideSearchForm',
                title: '和操作栏对称显示搜索表单',
              },
            },
            {
              type: 'digit',
              settings: {
                dataIndex: 'searchFormItemChunkSize',
                title: 'searchFormItemChunkSize',
                min: 1,
                max: 5,
              },
            },
            {
              type: 'digit',
              settings: {
                dataIndex: 'searchFormSettingsLabelColSpan',
                title: 'searchFormSettingsLabelColSpan',
                min: 1,
                max: 24,
              },
            },
            {
              type: 'digit',
              settings: {
                dataIndex: 'searchFormSettingsWrapperColSpan',
                title: 'searchFormSettingsWrapperColSpan',
                min: 1,
                max: 24,
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'groupItemSettings.gutter',
                dataIndex: 'gutter',
              },
            },
            {
              type: 'radio',
              settings: {
                title: 'fieldItemSettings.labelAlign',
                dataIndex: 'labelAlign',
                valueEnums: {
                  left: 'left',
                  right: 'right',
                },
              },
            },
            {
              type: 'switch',
              settings: {
                title: 'fieldItemSettings.readonly',
                dataIndex: 'readonly',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'fieldItemSettings.colSpan',
                dataIndex: 'colSpan',
              },
            },
          ],
        }}
      />
      <Divider />
      <OSTable
        key={key}
        settings={{
          syncURLParams: settings.syncURLParams,
          tableKey: 'search-form',
          searchFormItemChunkSize: settings.searchFormItemChunkSize,
          searchFormSettings: {
            groupItemSettings: {
              gutter: settings.gutter,
            },
            fieldItemSettings: {
              labelCol: {
                span: settings.searchFormSettingsLabelColSpan,
              },
              wrapperCol: {
                span: settings.searchFormSettingsWrapperColSpan,
              },
              labelAlign: settings.labelAlign as 'left' | 'right',
              readonly: settings.readonly,
              colSpan: settings.colSpan,
            },
          },
          batchOperation: ({ selectedRowKeys }) => {
            return [
              <OSDialog
                type="popconfirm"
                settings={{
                  title: '是否执行实时同步?',
                }}
              >
                <OSTrigger
                  type="button"
                  settings={{
                    text: '实时同步',
                    type: 'primary',
                    disabled: !selectedRowKeys.length,
                  }}
                />
              </OSDialog>,
            ];
          },
          fieldItems: settings?.leftSideSearchForm
            ? fieldItems.slice(0, settings.searchFormItemChunkSize).concat(
                fieldItems.slice(settings.searchFormItemChunkSize).map((item) =>
                  produce(item, (draft) => {
                    if (draft.children) {
                      // eslint-disable-next-line no-param-reassign
                      draft.children = draft.children.map((it) =>
                        produce(it, (draftIt) => {
                          (
                            draftIt as RequiredRecursion<OSTableFormFieldItemExtra>
                          ).settings.search = false;
                        }),
                      );
                    } else {
                      // eslint-disable-next-line no-param-reassign
                      (draft as RequiredRecursion<OSTableFormFieldItemExtra>).settings.search =
                        false;
                    }
                  }),
                ),
              )
            : fieldItems,
        }}
        requests={{
          requestDataSource: async () => {
            await delay(1000);

            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    field: () => Random.word(),
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
                total: 20,
              },
            });
          },
        }}
      ></OSTable>
    </OSProviderWrapper>
  );
};

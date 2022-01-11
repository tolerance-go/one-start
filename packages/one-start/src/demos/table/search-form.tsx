/* eslint-disable no-param-reassign */
/**
 * transform: true
 */
import type {
  OSTableFormFieldItemExtra,
  OSTableType,
  RequiredRecursion,
} from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTable } from '@ty-one-start/one-start';
import { Divider } from '@ty/antd';
import delay from 'delay';
import produce from 'immer';
import Mock, { Random } from 'mockjs';
import moment from 'moment';
import React, { useState } from 'react';

export default () => {
  const [values, setValues] = useState({
    leftSideSearchForm: false,
    searchFormItemChunkSize: 3,
    searchFormSettingsLabelColSpan: 4,
    searchFormSettingsWrapperColSpan: 20,
    gutter: 10,
    labelAlign: 'right',
    readonly: false,
    colSpan: 8,
    singleSearchForm: true,
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
          },
        },
        {
          type: 'select',
          settings: {
            search: true,
            title: 'select-search',
            dataIndex: 'select-search',
            showSearch: true,
            mode: 'multiple',
          },
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
      ],
    },
  ];

  return (
    <OSProviderWrapper>
      <OSForm
        onValuesChange={(_, values_) => {
          setValues(values_);
        }}
        settings={{
          initialValues: values,
          fieldItems: [
            {
              type: 'switch',
              settings: {
                dataIndex: 'leftSideSearchForm',
                title: '和操作栏对称显示搜索表单',
              },
            },
            {
              type: 'switch',
              settings: {
                dataIndex: 'singleSearchForm',
                title: '单行搜索表单始终对称显示',
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
        settings={{
          singleSearchForm: values.singleSearchForm,
          searchFormItemChunkSize: values.searchFormItemChunkSize,
          searchFormSettings: {
            groupItemSettings: {
              gutter: values.gutter,
            },
            fieldItemSettings: {
              labelCol: {
                span: values.searchFormSettingsLabelColSpan,
              },
              wrapperCol: {
                span: values.searchFormSettingsWrapperColSpan,
              },
              labelAlign: values.labelAlign as 'left' | 'right',
              readonly: values.readonly,
              colSpan: values.colSpan,
            },
          },
          fieldItems: values?.leftSideSearchForm
            ? fieldItems.slice(0, values.searchFormItemChunkSize).concat(
                fieldItems.slice(values.searchFormItemChunkSize).map((item) =>
                  produce(item, (draft) => {
                    if (draft.children) {
                      draft.children = draft.children.map((it) =>
                        produce(it, (draftIt) => {
                          (
                            draftIt as RequiredRecursion<OSTableFormFieldItemExtra>
                          ).settings.search = false;
                        }),
                      );
                    } else {
                      (draft as RequiredRecursion<OSTableFormFieldItemExtra>).settings.search =
                        false;
                    }
                  }),
                ),
              )
            : fieldItems,
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

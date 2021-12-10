/**
 * transform: true
 */
import { OSForm, OSProviderWrapper, OSTable } from '@ty-one-start/one-start';
import { Divider } from '@ty/antd';
import delay from 'delay';
import Mock, { Random } from 'mockjs';
import React, { useState } from 'react';

export default () => {
  const [values, setValues] = useState({
    searchFormItemChunkSize: 1,
    searchFormSettingsLabelColSpan: 4,
    searchFormSettingsWrapperColSpan: 20,
  });
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
                dataIndex: 'left-side-search-form',
                title: '左侧相对操作栏显示搜索表单',
                tooltip:
                  '当 fieldItems 的 length <= searchFormItemChunkSize 时候，将左右显示搜索表单',
              },
            },
            {
              type: 'digit',
              settings: {
                dataIndex: 'searchFormItemChunkSize',
                title: 'searchFormItemChunkSize',
                min: 1,
                max: 10,
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
          ],
        }}
      />
      <Divider />
      <OSTable
        settings={{
          searchFormItemChunkSize: values.searchFormItemChunkSize,
          searchFormSettings: {
            labelCol: {
              span: values.searchFormSettingsLabelColSpan,
            },
            wrapperCol: {
              span: values.searchFormSettingsWrapperColSpan,
            },
          },
          fieldItems: [
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
                search: !values['left-side-search-form'],
              },
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
                search: !values['left-side-search-form'],
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
                search: !values['left-side-search-form'],
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
                    search: !values['left-side-search-form'],
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
                    search: !values['left-side-search-form'],
                  },
                },
                {
                  type: 'date-range',
                  settings: {
                    title: 'date-range',
                    dataIndex: 'date-range',
                    search: !values['left-side-search-form'],
                  },
                },
                {
                  type: 'select',
                  settings: {
                    search: !values['left-side-search-form'],
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
                    search: !values['left-side-search-form'],
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

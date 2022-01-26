import type { RecordType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSTable } from '@ty-one-start/one-start';
import delay from 'delay';
import utlFp from 'lodash/fp';
import Mock from 'mockjs';
import React from 'react';
import utl from 'lodash';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          fieldItems: [
            {
              type: 'select',
              settings: ({ rowId }) => ({
                title: 'select',
                dataIndex: 'select',
                fixed: 'left',
                rules: [
                  {
                    required: true,
                  },
                  ({ getFieldValue, getFieldsValue }) => ({
                    validator(rule, val?: string) {
                      if (val == null) {
                        return Promise.resolve();
                      }

                      const currentSelectVal = getFieldValue([rowId!, 'select']);

                      const tableValues = getFieldsValue();

                      const otherSelectValues = utlFp.flow(
                        utlFp.omit([rowId!]),
                        utlFp.mapValues((rowData: RecordType) => rowData.select),
                        utlFp.values,
                        /** 过滤空值 */
                        utlFp.filter(Boolean),
                      )(tableValues);

                      if (otherSelectValues.includes(currentSelectVal)) {
                        return Promise.reject(new Error('不能有重复的选项'));
                      }

                      return Promise.resolve();
                    },
                  }),
                ],
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
                editable: true,
              }),
            },
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
                editable: true,
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
                rules: [
                  {
                    required: true,
                  },
                ],
                editable: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
              },
            },
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
            {
              type: 'date-range',
              settings: {
                title: 'date-range',
                dataIndex: 'date-range',
              },
            },
            {
              type: 'select',
              settings: ({ dataSource }) => {
                return {
                  title: 'select',
                  dataIndex: 'select',
                  valueEnums: utl.fromPairs(
                    dataSource?.map((item: RecordType) => [item.select, item.select]),
                  ),
                };
              },
            },
            {
              type: 'select',
              settings: {
                title: 'select-search',
                dataIndex: 'select-search',
                mode: 'multiple',
                editable: true,
                rules: [
                  {
                    required: true,
                  },
                ],
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
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
                fixed: 'right',
                editable: true,
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
          ],
        }}
        requests={{
          requestDataSource: async (options) => {
            console.log(options);

            await delay(1000);

            return {
              error: false,
              data: {
                page: [
                  {
                    id: '1',
                    ...Mock.mock({
                      money: '@integer',
                      percent: '@integer',
                      money2: '@integer',
                      percent2: '@integer',
                    }),
                  },
                  {
                    id: '2',
                    ...Mock.mock({
                      money: '@integer',
                      percent: '@integer',
                      money2: '@integer',
                      percent2: '@integer',
                    }),
                  },
                ],
                total: 2,
              },
            };
          },
        }}
      ></OSTable>
    </OSProviderWrapper>
  );
};

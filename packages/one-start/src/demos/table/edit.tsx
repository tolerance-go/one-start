import {
  OSProviderWrapper,
  OSTable,
  OSTableValueType,
  parseTableValue,
} from '@ty-one-start/one-start';
import delay from 'delay';
import Mock from 'mockjs';
import React, { useState } from 'react';
import {} from '../../components/utils/parse-table-value';

export default () => {
  const [value, setValue] = useState<OSTableValueType>();

  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSTable
        onChange={(e) => setValue(parseTableValue(e))}
        value={value}
        settings={{
          editableRowKeys: ['1'],
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
                sorter: true,
                editable: false,
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
                editable: true,
              },
            },
            {
              type: 'group',
              settings: {
                title: '分组1',
              },
              children: [
                {
                  type: 'money',
                  settings: {
                    title: 'money2',
                    dataIndex: 'money2',
                    editable: true,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'percent',
                  settings: {
                    title: 'percent2',
                    dataIndex: 'percent2',
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

            return {
              error: false,
              data: {
                page: [
                  {
                    id: '1asdfasdf',
                    ...Mock.mock({
                      money: '@integer',
                      percent: '@integer',
                      money2: '@integer',
                      percent2: '@integer',
                    }),
                  },
                  {
                    id: '2asdfasdf',
                    ...Mock.mock({
                      money: '@integer',
                      percent: '@integer',
                      money2: '@integer',
                      percent2: '@integer',
                    }),
                  },
                  {
                    id: '3',
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

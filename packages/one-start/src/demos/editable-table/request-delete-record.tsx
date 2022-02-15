import type { RecordType } from '@ty-one-start/one-start';
import { OSEditableTable, OSProviderWrapper, parseTableValue } from '@ty-one-start/one-start';
import React, { useState } from 'react';
import delay from 'delay';
import { mock, Random } from 'mockjs';

const tableData = mock({
  error: false,
  data: {
    'page|11': [
      {
        id: () => Random.id(),
        count: () => Random.increment(),
        text: () => Random.ctitle(5),
        date: () => Random.date('yyyy-MM-dd'),
        digit: () => Random.natural(1, 100),
      },
    ],
    total: 11,
  },
});

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>();
  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSEditableTable
        value={value}
        onChange={(e) => setValue(parseTableValue(e))}
        settings={{
          rowActions: {
            width: 80,
            columnTitle: '自定义操作',
          },
          fieldItems: [
            {
              type: 'digit',
              settings: {
                dataIndex: 'count',
                title: 'count',
                editable: true,
              },
            },
            {
              type: 'text',
              settings: {
                dataIndex: 'text',
                title: 'text',
                editable: true,
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
                editable: true,
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
                editable: true,
              },
            },
          ],
          addable: {},
          removeable: {},
        }}
        requests={{
          requestDataSource: async () => {
            return tableData;
          },
          requestRemoveRecord: async (options) => {
            console.log(options);
            await delay(1000);
            return {
              error: false,
            };
          },
        }}
      ></OSEditableTable>
    </OSProviderWrapper>
  );
};

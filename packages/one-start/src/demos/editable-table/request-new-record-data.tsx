import type { RecordType } from '@ty-one-start/one-start';
import { OSEditableTable, OSProviderWrapper, parseTableValue } from '@ty-one-start/one-start';
import React, { useState } from 'react';
import delay from 'delay';

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>();
  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSEditableTable
        value={value}
        onChange={(e) => setValue(parseTableValue(e))}
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: 'text',
                title: 'text',
                editable: true,
                autoFocus: true,
                initialValue: 'hi',
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
                initialValue: 100,
              },
            },
          ],
          addable: {},
        }}
        requests={{
          requestNewRecordData: async ({ rowData, dataSource }) => {
            console.log(dataSource);
            await delay(1000);
            return {
              error: false,
              data: {
                date: '1994-2-13',
                digit: 10000,
                ...rowData,
              },
            };
          },
        }}
      ></OSEditableTable>
    </OSProviderWrapper>
  );
};

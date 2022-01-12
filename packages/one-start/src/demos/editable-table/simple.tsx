import type { RecordType } from '@ty-one-start/one-start';
import { OSEditableTable, OSProviderWrapper, parseTableValue } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>([
    {
      id: '1',
      text: 'text',
    },
  ]);
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
        }}
      ></OSEditableTable>
    </OSProviderWrapper>
  );
};

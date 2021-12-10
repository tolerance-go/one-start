import type { RecordType } from '@ty-one-start/one-start';
import { OSEditableTable, OSProviderWrapper, parseTableValue } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>([
    {
      id: '1asdf',
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
                autoFocus: true,
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
            {
              type: 'select',
              settings: {
                dataIndex: 'select',
                title: 'select',
                showSearch: true,
                valueEnums: {
                  a: 'A',
                  b: 'B',
                },
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
                rules: [
                  {
                    required: true,
                  },
                ],
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
          ],
          addable: {},
        }}
      ></OSEditableTable>
    </OSProviderWrapper>
  );
};

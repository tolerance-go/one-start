import type { RecordType } from '@ty-one-start/one-start';
import { OSEditableTable, OSProviderWrapper, parseTableValue } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>();
  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSEditableTable
        value={value}
        onChange={(e) => setValue(parseTableValue(e))}
        settings={{
          addable: {},
          removeable: {},
          fieldItems: [
            {
              type: 'select',
              settings: {
                title: 'selectA',
                dataIndex: 'selectA',
                valueEnums: {
                  a: 'a',
                  b: 'b',
                  c: 'c',
                },
              },
            },
            {
              type: 'atom',
              dependencies: ['selectA'],
              settings: ({ form, rowId }) => ({
                title: 'atom',
                dataIndex: 'atom',
                ...(form.getFieldValue([rowId!, 'selectA']) === 'a'
                  ? {
                      type: 'select',
                      settings: {
                        valueEnums: {
                          a: 'a',
                          b: 'b',
                          c: 'c',
                        },
                      },
                    }
                  : {
                      type: 'text',
                    }),
              }),
            },
          ],
        }}
      ></OSEditableTable>
    </OSProviderWrapper>
  );
};

import type { RecordType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSTable, parseTableValue } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType[]>();

  return (
    <OSProviderWrapper>
      <OSTable
        value={value}
        onChange={(next) => setValue(parseTableValue(next))}
        settings={{
          fieldItems: [
            {
              type: 'radio',
              settings: {
                title: 'radio',
                dataIndex: 'radio',
                search: true,
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
              },
            },
          ],
        }}
        requests={{
          requestDataSource: async () => {
            return {
              error: false,
              data: {
                page: [
                  {
                    id: '1',
                    radio: 'a',
                  },
                ],
                total: 1,
              },
            };
          },
        }}
      />
    </OSProviderWrapper>
  );
};

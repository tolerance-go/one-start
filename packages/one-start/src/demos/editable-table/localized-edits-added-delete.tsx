import type { RecordType } from '@ty-one-start/one-start';
import { OSEditableTable, OSProviderWrapper, parseTableValue } from '@ty-one-start/one-start';
import React, { useState } from 'react';
import { OSTrigger } from '../../components';

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>();
  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSEditableTable
        value={value}
        onChange={(e) => setValue(parseTableValue(e))}
        settings={{
          enableEditedCellDiffValueState: {},
          actions: ({ actions }) => [
            <OSTrigger
              type="button"
              settings={{
                text: '保存',
                type: 'primary',
              }}
              requests={{
                requestAfterSync: async () => {
                  console.log(actions.getTableFormEditedData?.());
                },
              }}
            />,
          ],
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
      ></OSEditableTable>
    </OSProviderWrapper>
  );
};

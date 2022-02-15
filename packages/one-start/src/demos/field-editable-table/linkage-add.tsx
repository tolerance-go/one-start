import { OSForm, OSProviderWrapper, RecordType } from '@ty-one-start/one-start';
import delay from 'delay';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType | undefined>({
    text: 'text',
    digit: 10000,
  });
  return (
    <OSProviderWrapper>
      <div>onChange values:</div>
      <pre>{JSON.stringify(value, null, 2)}</pre>
      <OSForm
        value={value}
        onChange={setValue}
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: 'text',
                title: 'text',
              },
            },
            {
              type: 'digit',
              settings: {
                dataIndex: 'digit',
                title: 'digit',
              },
            },
            {
              type: 'editable-table',
              settings: {
                dataIndex: 'editable-table',
                title: 'editable-table',
                changedValueHasMeta: true,
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
                addable: {},
                removeable: {},
              },
              requests: {
                requestNewRecordData: async ({ rowData, dataSource, form }) => {
                  console.log(dataSource);
                  await delay(1000);
                  return {
                    error: false,
                    data: {
                      ...rowData,
                      text: form?.getFieldValue('text'),
                      date: '1994-2-13',
                      digit: 10000,
                    },
                  };
                },
                requestRemoveRecord: async ({ form }) => {
                  await delay(1000);

                  if (form?.getFieldValue('digit') > 10000) {
                    return {
                      error: true,
                    };
                  }
                  return {
                    error: false,
                  };
                },
              },
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};

import { OSForm, OSProviderWrapper, RecordType } from '@ty-one-start/one-start';
import { mock, Random } from 'mockjs';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType>();
  return (
    <OSProviderWrapper>
      <pre>{JSON.stringify(value, null, 2)}</pre>
      <OSForm
        value={value}
        onChange={setValue}
        settings={{
          initialValues: {
            'editable-table': mock({
              'list|3': [
                {
                  text: '@word',
                  date: '@date',
                  digit: () => Random.integer(),
                },
              ],
            }).list,
          },
          fieldItems: [
            {
              type: 'editable-table',
              settings: {
                title: 'editable-table',
                dataIndex: 'editable-table',
                pagination: {
                  defaultPageSize: 1,
                },
                fieldItems: [
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
                      search: true,
                    },
                  },
                ],
              },
              requests: {
                requestVisualDataSource: async ({ search, dataSource }) => {
                  return {
                    error: false,
                    data: search.digit
                      ? dataSource?.filter((item) => item.digit > search.digit)
                      : dataSource,
                  };
                },
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

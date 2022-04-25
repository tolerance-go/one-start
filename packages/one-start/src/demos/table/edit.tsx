import type { OSTableValueType, RecordType, OSTableChangeValueType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTable, parseTableValue } from '@ty-one-start/one-start';
import { Divider } from 'antd';
import delay from 'delay';
import Mock from 'mockjs';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSTableValueType>();
  const [event, setEvent] = useState<OSTableChangeValueType>();
  const [settings, setSettings] = useState<undefined | RecordType>({
    changeDebounceTimestamp: 450,
  });

  return (
    <OSProviderWrapper>
      <OSForm
        value={settings}
        onChange={setSettings}
        settings={{
          fieldItems: [
            {
              type: 'switch',
              settings: {
                title: 'changedValuehasMeta',
                dataIndex: 'changedValuehasMeta',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'changeDebounceTimestamp',
                dataIndex: 'changeDebounceTimestamp',
              },
            },
          ],
        }}
      />
      <Divider />
      <pre>{JSON.stringify(event, null, 2)}</pre>
      <OSTable
        onChange={(e) => {
          setEvent(e);
          setValue(parseTableValue(e));
        }}
        value={value}
        settings={{
          changeDebounceTimestamp: settings?.changeDebounceTimestamp,
          changedValueHasMeta: settings?.changedValuehasMeta,
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
                    id: '1',
                    ...Mock.mock({
                      money: '@integer',
                      percent: '@integer',
                      money2: '@integer',
                      percent2: '@integer',
                    }),
                  },
                  {
                    id: '2',
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

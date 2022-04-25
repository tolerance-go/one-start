import { OSForm, OSProviderWrapper, OSTable, OSTrigger } from '@ty-one-start/one-start';
import { Divider } from 'antd';
import delay from 'delay';
import Mock, { Random } from 'mockjs';
import React, { useState } from 'react';

export default () => {
  const [key, setKey] = useState('');
  const [settings, setSettings] = useState({
    enableRowBulk: true,
  });

  return (
    <OSProviderWrapper>
      <OSForm
        onValuesChange={(_, values_) => {
          if ('enableRowBulk' in values_) {
            setKey(Random.id());
          }
          setSettings(values_);
        }}
        settings={{
          size: 'small',
          layout: 'inline',
          initialValues: settings,
          fieldItems: [
            {
              type: 'switch',
              settings: {
                dataIndex: 'enableRowBulk',
                title: '开启批量操作',
                className: 't_enableRowBulk',
              },
            },
          ],
        }}
      />
      <Divider />
      <OSTable
        key={key}
        settings={{
          rowSelection: {
            quicklyBulkSelection: true,
            defaultSelectAllAfterSearch: true,
          },
          batchOperation: settings.enableRowBulk
            ? () => {
                return [
                  <OSTrigger
                    type="button"
                    settings={{
                      text: '批量下载',
                      type: 'primary',
                    }}
                  ></OSTrigger>,
                  <OSTrigger
                    type="button"
                    settings={{
                      text: '批量导出',
                      type: 'primary',
                    }}
                  ></OSTrigger>,
                ];
              }
            : undefined,
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                sorter: true,
                search: true,
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
                sorter: true,
                search: true,
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
                sorter: true,
                search: true,
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
                search: true,
              },
            },
            {
              type: 'group',
              settings: {
                title: '分组',
              },
              children: [
                {
                  type: 'text',
                  settings: {
                    title: 'text',
                    dataIndex: 'text',
                    search: true,
                  },
                },
                {
                  type: 'textarea',
                  settings: {
                    title: 'textarea',
                    dataIndex: 'textarea',
                  },
                },
                {
                  type: 'select',
                  settings: {
                    search: true,
                    title: 'select',
                    dataIndex: 'select',
                    valueEnums: {
                      a: 'A',
                      b: 'B',
                    },
                  },
                },
              ],
            },
          ],
        }}
        requests={{
          requestDataSource: async () => {
            await delay(1000);

            return Mock.mock({
              error: false,
              data: {
                'page|100': [
                  {
                    id: '@id',
                    money: '@integer',
                    digit: '@integer',
                    percent: '@integer',
                    date: '@date',
                    text: '@word',
                    textarea: '@word',
                    select: () => Random.pick(['a', 'b']),
                  },
                ],
                total: 100,
              },
            });
          },
        }}
      ></OSTable>
    </OSProviderWrapper>
  );
};

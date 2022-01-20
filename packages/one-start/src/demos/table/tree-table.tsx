import type { RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTable, OSTrigger } from '@ty-one-start/one-start';
import { Divider } from '@ty/antd';
import delay from 'delay';
import React, { useState } from 'react';

export default () => {
  const [settings, setSettings] = useState<RecordType | undefined>({
    checkStrictly: false,
  });

  return (
    <OSProviderWrapper>
      <OSForm
        onChange={setSettings}
        settings={{
          initialValues: settings,
          fieldItems: [
            {
              type: 'switch',
              settings: {
                dataIndex: 'checkStrictly',
                title: '是否关闭联动选择',
              },
            },
          ],
        }}
      />
      <Divider />
      <OSTable
        settings={{
          batchOperation: () => {
            return [
              <OSTrigger
                type="button"
                settings={{
                  text: '批量下载',
                  type: 'primary',
                }}
              ></OSTrigger>,
            ];
          },
          fieldItems: [
            {
              type: 'text',
              settings: {
                title: 'name',
                dataIndex: 'name',
                rules: [
                  {
                    required: true,
                  },
                ],
                sorter: true,
                search: true,
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'age',
                dataIndex: 'age',
                rules: [
                  {
                    required: true,
                  },
                ],
                sorter: true,
                search: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: 'sex',
                dataIndex: 'isMale',
                rules: [
                  {
                    required: true,
                  },
                ],
                sorter: true,
                search: true,
              },
              render: ({ rowData }) => {
                return rowData.isMale ? '女' : '男';
              },
            },
          ],
          rowSelection: {
            checkStrictly: settings?.checkStrictly,
          },
        }}
        requests={{
          requestDataSource: async (options) => {
            console.log(options);

            await delay(1000);

            const data = [
              {
                id: 11,
                name: '张三11',
                age: 60,
                children: [
                  {
                    id: 21,
                    name: '李四21',
                    age: 42,
                    children: [
                      {
                        id: 31,
                        name: '王五31',
                        age: 42,
                      },
                      {
                        id: 32,
                        name: '马六32',
                        age: 30,
                      },
                    ],
                  },
                  {
                    id: 22,
                    name: '李四22',
                    age: 42,
                    children: [
                      {
                        id: 33,
                        name: '王五33',
                        age: 42,
                      },
                      {
                        id: 34,
                        name: '马六34',
                        age: 30,
                      },
                    ],
                  },
                ],
              },
              {
                id: 12,
                name: '张三12',
                age: 60,
                children: [
                  {
                    id: 23,
                    name: '李四23',
                    age: 42,
                    children: [
                      {
                        id: 35,
                        name: '王五35',
                        age: 42,
                      },
                      {
                        id: 36,
                        name: '马六36',
                        age: 30,
                      },
                    ],
                  },
                  {
                    id: 24,
                    name: '李四24',
                    age: 42,
                    children: [
                      {
                        id: 37,
                        name: '王五37',
                        age: 42,
                      },
                      {
                        id: 38,
                        name: '王五38',
                        age: 30,
                      },
                    ],
                  },
                ],
              },
            ];

            return {
              error: false,
              data: {
                page: data,
                total: data.length,
              },
            };
          },
        }}
      ></OSTable>
    </OSProviderWrapper>
  );
};

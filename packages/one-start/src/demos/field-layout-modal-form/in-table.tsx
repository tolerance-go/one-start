import type { RecordType } from '@ty-one-start/one-start';
import { OSEditableTable, OSProviderWrapper, parseTableValue } from '@ty-one-start/one-start';
import delay from 'delay';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>([
    {
      id: '1',
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
            {
              type: 'layout-modal-form',
              settings: {
                editable: true,
                title: 'layout-modal-form',
                dataIndex: 'layout-modal-form',
                buttonTriggerText: '按钮1',
                modalDialogSettings: {
                  title: '标题',
                },
                formSettings: {
                  initialValues: {
                    money: 0,
                    digit: 234234,
                  },
                },
                formFieldItems: [
                  {
                    type: 'money',
                    settings: {
                      title: 'money',
                      dataIndex: 'money',
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: 'digit',
                      dataIndex: 'digit',
                    },
                  },
                  {
                    type: 'percent',
                    settings: {
                      title: 'percent',
                      dataIndex: 'percent',
                    },
                  },
                  {
                    type: 'date',
                    settings: {
                      title: 'date',
                      dataIndex: 'date',
                    },
                  },
                  {
                    type: 'date-range',
                    settings: {
                      title: 'date-range',
                      dataIndex: 'date-range',
                    },
                  },
                  {
                    type: 'select',
                    settings: {
                      title: 'select',
                      dataIndex: 'select',
                      valueEnums: {
                        a: 'A',
                        b: 'B',
                        c: 'C',
                      },
                    },
                  },
                  {
                    type: 'select',
                    settings: {
                      title: 'selectMultiple',
                      dataIndex: 'selectMultiple',
                      valueEnums: {
                        a: 'A',
                        b: 'B',
                        c: 'C',
                      },
                      mode: 'multiple',
                    },
                  },
                  {
                    type: 'text',
                    settings: {
                      title: 'text',
                      dataIndex: 'text',
                    },
                  },
                  {
                    type: 'textarea',
                    settings: {
                      title: 'textarea',
                      dataIndex: 'textarea',
                    },
                  },
                ],
              },
              requests: {
                requestFormDataSource: async () => {
                  await delay(1000);
                  return {
                    error: false,
                    data: {
                      money: 234234234234,
                      digit: 234234,
                      percent: 2342.34,
                      date: '2021-09-15T13:12:05.422Z',
                      'date-range': ['2021-09-08T13:12:06.868Z', '2021-10-10T13:12:06.868Z'],
                      select: 'a',
                      selectMultiple: ['b', 'a'],
                      text: '324',
                      textarea: '234',
                    },
                  };
                },
              },
            },
          ],
        }}
      ></OSEditableTable>
    </OSProviderWrapper>
  );
};

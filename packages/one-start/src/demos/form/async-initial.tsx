import delay from 'delay';
import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { mock, Random } from 'mockjs';
import moment from 'moment';
import React, { useState, useRef } from 'react';
import { Button } from '@ty/antd';

export default () => {
  const [values, setValues] = useState<RecordType | undefined>();
  const formRef = useRef<OSFormAPI>(null);
  return (
    <OSProviderWrapper>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <OSForm
        ref={formRef}
        value={values}
        onChange={setValues}
        settings={{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                readonly: false,
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
                readonly: false,
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
            {
              type: 'editable-table',
              settings: {
                dataIndex: 'editable-table',
                title: 'editable-table',
                fieldItems: [
                  {
                    type: 'money',
                    settings: {
                      title: 'money',
                      dataIndex: 'money',
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
                    type: 'percent',
                    settings: {
                      title: 'percent',
                      dataIndex: 'percent',
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
                    type: 'date-range',
                    settings: {
                      title: 'date-range',
                      dataIndex: 'date-range',
                      editable: true,
                    },
                  },
                  {
                    type: 'select',
                    settings: {
                      title: 'select',
                      dataIndex: 'select',
                      editable: true,
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
                      editable: true,
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
                      editable: true,
                    },
                  },
                  {
                    type: 'textarea',
                    settings: {
                      title: 'textarea',
                      dataIndex: 'textarea',
                      editable: true,
                    },
                  },
                ],
              },
            },
          ],
        }}
        requests={{
          requestInitialValues: async () => {
            await delay(1000);

            return mock({
              error: false,
              data: {
                money: () => Random.integer(),
                digit: () => Random.integer(),
                percent: () => Random.integer(),
                date: () => moment(),
                'date-range': () => [moment(), moment()],
                select: () => Random.pick(['a', 'b', 'c']),
                selectMultiple: ['a', 'b'],
                text: () => Random.word(),
                textarea: () => Random.paragraph(),
                'editable-table': () => [
                  mock({
                    error: false,
                    data: {
                      id: '@id',
                      money: () => Random.integer(),
                      digit: () => Random.integer(),
                      percent: () => Random.integer(),
                      date: () => moment(),
                      'date-range': () => [moment(), moment()],
                      select: () => Random.pick(['a', 'b', 'c']),
                      selectMultiple: ['a', 'b'],
                      text: () => Random.word(),
                      textarea: () => Random.paragraph(),
                      'editable-table': () => {},
                    },
                  }).data,
                ],
              },
            });
          },
        }}
      />
      <div>
        <Button
          onClick={() => {
            formRef.current?.resetFields();
          }}
        >
          重置
        </Button>
      </div>
    </OSProviderWrapper>
  );
};

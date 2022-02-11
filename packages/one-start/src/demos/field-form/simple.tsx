import type { RecordType } from '@ty-one-start/one-start';
import { OSFormField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [values, setValues] = useState<RecordType | undefined>({
    money: 234234234234,
  });
  return (
    <OSProviderWrapper>
      <Space>
        <div>
          <div>{JSON.stringify(values)}</div>
          <OSFormField
            mode="edit"
            settings={{
              initialValues: {
                money: 0,
                digit: 234234,
              },
              fieldItems: [
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
            }}
            value={values}
            onChange={setValues}
          />
        </div>
        <div>
          <div>{JSON.stringify(values)}</div>
          <OSFormField
            mode="read"
            settings={{
              initialValues: {
                money: 0,
                digit: 234234,
              },
              fieldItems: [
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
            }}
            value={values}
            onChange={setValues}
          />
        </div>
      </Space>
    </OSProviderWrapper>
  );
};

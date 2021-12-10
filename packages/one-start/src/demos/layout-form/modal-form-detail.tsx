import type { OSFormAPI } from '@ty-one-start/one-start';
import { OSLayoutForm, OSProviderWrapper, RecordType } from '@ty-one-start/one-start';
import delay from 'delay';
import React, { useRef, useState } from 'react';

export default () => {
  const formRef = useRef<OSFormAPI>(null);
  const [values, setValues] = useState<RecordType | undefined>();

  return (
    <>
      <div>{JSON.stringify(values)}</div>
      <OSProviderWrapper>
        <OSLayoutForm
          ref={formRef}
          type="modal-form"
          settings={{
            buttonTriggerText: '按钮1',
            modalDialogSettings: {
              title: '标题',
            },
            formFieldItems: [
              {
                type: 'money',
                settings: {
                  title: 'money',
                  dataIndex: 'money',
                  readonly: true,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                },
              },
              {
                type: 'digit',
                settings: {
                  title: 'digit',
                  dataIndex: 'digit',
                  readonly: true,
                },
              },
              {
                type: 'percent',
                settings: {
                  title: 'percent',
                  dataIndex: 'percent',
                  readonly: true,
                },
              },
              {
                type: 'date',
                settings: {
                  title: 'date',
                  dataIndex: 'date',
                  readonly: true,
                },
              },
              {
                type: 'date-range',
                settings: {
                  title: 'date-range',
                  dataIndex: 'date-range',
                  readonly: true,
                },
              },
              {
                type: 'select',
                settings: {
                  title: 'select',
                  dataIndex: 'select',
                  readonly: true,
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
                  readonly: true,
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
                  readonly: true,
                },
              },
              {
                type: 'textarea',
                settings: {
                  title: 'textarea',
                  dataIndex: 'textarea',
                  readonly: true,
                },
              },
            ],
          }}
          value={values}
          onChange={setValues}
          requests={{
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
          }}
        />
      </OSProviderWrapper>
    </>
  );
};

import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import { OSLayoutForm, OSProviderWrapper, OSTrigger, OSForm } from '@ty-one-start/one-start';
import React, { useRef, useState } from 'react';
import { Divider, Space } from '@ty/antd';

export default () => {
  const formRef = useRef<OSFormAPI>(null);
  const [values, setValues] = useState<RecordType | undefined>();

  return (
    <>
      <div>{JSON.stringify(values)}</div>
      <OSProviderWrapper>
        <Space>
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
          <OSTrigger
            type="button"
            settings={{
              text: '验证表单',
            }}
            onClick={() => {
              formRef.current?.validate();
            }}
          ></OSTrigger>
        </Space>
        <Divider />
        <OSForm
          settings={{
            fieldItems: [
              {
                type: 'layout-modal-form',
                settings: {
                  title: 'modal',
                  dataIndex: 'modal',
                  buttonTriggerText: 'modal',
                  formFieldItems: [
                    {
                      type: 'digit',
                      settings: {
                        title: 'digit',
                        dataIndex: 'digit',
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          }}
        ></OSForm>
      </OSProviderWrapper>
    </>
  );
};

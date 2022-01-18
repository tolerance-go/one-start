import type { OSFormAPI } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useRef } from 'react';

export default () => {
  const formRef = useRef<OSFormAPI>(null);
  return (
    <OSProviderWrapper>
      <OSForm
        ref={formRef}
        settings={{
          fieldItems: [
            {
              type: 'placeholder-input',
              settings: {
                title: 'placeholder-input',
                dataIndex: 'placeholderInput',
                placeholders: [
                  {
                    label: 'label1',
                    value: 'label1',
                  },
                  {
                    label: 'label2',
                    value: 'label2',
                  },
                  {
                    label: 'label3',
                    value: 'label3',
                  },
                ],
              },
            },
            {
              type: 'time-lag',
              settings: {
                title: '互换起始日',
                dataIndex: 'startDay',
                addonBefore: 'T +',
              },
            },
            {
              type: 'radio',
              settings: {
                title: 'radio',
                dataIndex: 'radio',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
              },
            },
            {
              type: 'money',
              settings: {
                title: '合约编号',
                dataIndex: 'contractCode',
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
            {
              type: 'chain-select',
              settings: {
                title: 'chain-select',
                dataIndex: 'chain-select',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
              },
            },
            {
              type: 'percent',
              settings: {
                title: '交易簿',
                dataIndex: 'bookName',
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
                    title: '合约编号',
                    dataIndex: 'contractCode',
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
                    title: '交易簿',
                    dataIndex: 'bookName',
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
                    },
                  },
                },
              ],
            },
            {
              type: 'editable-table',
              settings: {
                labelCol: {
                  span: 0,
                },
                wrapperCol: {
                  span: 24,
                },
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
              },
            },
          ],
        }}
      ></OSForm>
      values: {formRef.current}
    </OSProviderWrapper>
  );
};

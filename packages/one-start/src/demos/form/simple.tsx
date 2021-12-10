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
          ],
        }}
      ></OSForm>
      values: {formRef.current}
    </OSProviderWrapper>
  );
};

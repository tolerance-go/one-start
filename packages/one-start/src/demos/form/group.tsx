import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          fieldItems: [
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
    </OSProviderWrapper>
  );
};

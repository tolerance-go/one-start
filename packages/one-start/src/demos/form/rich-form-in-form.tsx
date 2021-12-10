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
              type: 'layout-modal-form',
              settings: {
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
                ],
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

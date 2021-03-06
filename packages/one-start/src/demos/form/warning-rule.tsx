import type { OSFormAPI } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { Button } from 'antd';
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
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                warningRules: [
                  {
                    validator: async (rule, value) => {
                      if (value == null || value < 100) {
                        return Promise.reject(new Error('value 为空，或者小于 100'));
                      }
                      return Promise.resolve();
                    },
                  },
                ],
              },
            },
          ],
        }}
      ></OSForm>
      <div>
        <Button
          onClick={async () => {
            const { error, data: values } = (await formRef.current?.validate()) ?? {};
            if (error) {
              console.log(values);
            } else {
              console.log(values);
            }
          }}
        >
          验证
        </Button>
        <Button
          onClick={async () => {
            formRef.current?.setFieldsValue({
              money: 20,
            });
          }}
        >
          setValues
        </Button>
      </div>
    </OSProviderWrapper>
  );
};

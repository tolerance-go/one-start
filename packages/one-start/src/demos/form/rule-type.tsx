import type { OSFormAPI } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { Button } from '@ty/antd';
import moment from 'moment';
import React, { useRef } from 'react';

export default () => {
  const formRef = useRef<OSFormAPI>(null);
  return (
    <OSProviderWrapper>
      <OSForm
        ref={formRef}
        settings={{
          formItemSettimgs: {
            labelCol: {
              span: 7,
            },
            wrapperCol: {
              span: 14,
            },
          },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: '数字精度校验',
                dataIndex: 'a',
                rules: [
                  {
                    ruleType: 'digital-accuracy',
                    settings: {
                      floatsMaxLen: 6,
                      integersMaxLen: 2,
                    },
                  },
                ],
              },
            },
            {
              type: 'date',
              settings: {
                title: '日期早晚校验1',
                dataIndex: 'b',
                rules: [
                  {
                    ruleType: 'date-check',
                    settings: {
                      date: moment(),
                      dateLabel: '今天',
                      type: 'isAfter',
                      granularity: 'd',
                    },
                  },
                ],
              },
            },
            {
              type: 'date',
              settings: {
                title: '日期早晚校验2',
                dataIndex: 'c',
                rules: [
                  {
                    ruleType: 'date-check',
                    settings: {
                      dataIndex: 'b',
                      dateLabel: '日期早晚校验1',
                      type: 'isAfter',
                      granularity: 'd',
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
      </div>
    </OSProviderWrapper>
  );
};

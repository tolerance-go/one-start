/* eslint-disable no-alert */
import type { OSFormAPI } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Row } from 'antd';
import { mock, Random } from 'mockjs';
import React, { useRef } from 'react';

export default () => {
  const formRef = useRef<OSFormAPI>(null);

  return (
    <OSProviderWrapper>
      <OSForm
        ref={formRef}
        settings={{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          fieldItems: [
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
                rules: [
                  {
                    ruleType: 'digital-scope',
                    settings: {
                      maxType: 'isLessThan',
                      maxDataIndex: 'max',
                    },
                  },
                ],
              },
            },
            {
              type: 'select',
              dependencies: ['valueEnums'],
              settings: ({ form }) => ({
                title: 'select',
                dataIndex: 'select',
                valueEnums: form.getFieldValue('valueEnums'),
              }),
            },
          ],
        }}
        requests={{
          requestDataSource: async (options) => {
            options.actions.setRefObject({
              max: 10,
              valueEnums: {
                a: 'A',
              },
            });
            options.actions.setRefObject((prev) => ({
              ...prev,
              max: prev.max * 10,
            }));
            options.actions.mergeRefObject({
              valueEnums: {
                a: 'A',
                b: 'B',
                c: 'C',
              },
            });
            return Promise.resolve(
              mock({
                error: false,
                data: {
                  digit: () => Random.integer(0, 10),
                  select: () => Random.pick(['a', 'b', 'c']),
                  ...options.actions.getRefObject(),
                },
              }),
            );
          },
        }}
      />
      <Row>
        <OSTrigger
          type="button"
          settings={{
            type: 'primary',
            text: '提交&查看额外数据',
          }}
          requests={{
            requestAfterClick: async () => {
              alert(JSON.stringify(formRef.current?.getRefObject()));
              alert(JSON.stringify(formRef.current?.getDataSource()));
              alert(JSON.stringify(await formRef.current?.validate()));
              return false;
            },
          }}
        />
      </Row>
    </OSProviderWrapper>
  );
};

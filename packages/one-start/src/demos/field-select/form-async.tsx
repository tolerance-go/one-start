import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import delay from 'delay';
import utlFp from 'lodash/fp';
import { mock } from 'mockjs';
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
              type: 'select',
              settings: {
                title: '下拉框1',
                dataIndex: 'select',
                showSearch: true,
                rules: [
                  ({ getFieldValue }) => ({
                    validateTrigger: [],
                    validator: async (rule, val) => {
                      if (val == null) {
                        return Promise.resolve();
                      }
                      const select2Val = getFieldValue('select2');
                      if (select2Val === val) {
                        return Promise.reject(new Error('和 select2 重复了'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ],
              },
              requests: {
                requestOptions: async ({ searchValue, form }) => {
                  console.log(
                    '🚀 ~ file: form-async.tsx ~ line 39 ~ requestOptions: ~ searchValue',
                    searchValue,
                  );
                  await delay(1000);
                  return mock({
                    error: false,
                    data: [
                      {
                        label: 'A',
                        value: 'a',
                      },
                      {
                        label: 'B',
                        value: 'b',
                      },
                      {
                        label: 'C',
                        value: 'c',
                      },
                    ].filter((item) => form?.getFieldValue('select2') !== item.value),
                  });
                },
              },
            },
            {
              type: 'select',
              settings: {
                title: '下拉框2',
                dataIndex: 'select2',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
              },
            },
            {
              type: 'editable-table',
              settings: {
                title: 'editable-table',
                dataIndex: 'editable-table',
                fieldItems: [
                  {
                    type: 'select',
                    settings: ({ rowId }) => ({
                      title: '下拉框1',
                      dataIndex: 'select',
                      showSearch: true,
                      rules: [
                        ({ getFieldValue }) => ({
                          validateTrigger: [],
                          validator: async (rule, val) => {
                            if (val == null) {
                              return Promise.resolve();
                            }
                            const select2Val = getFieldValue([rowId!, 'select2']);
                            if (select2Val === val) {
                              return Promise.reject(new Error('和 select2 重复了'));
                            }
                            return Promise.resolve();
                          },
                        }),
                      ],
                    }),
                    requests: {
                      requestOptions: async ({ form, rowId }) => {
                        console.log(
                          '🚀 ~ file: form-async.tsx ~ line 106 ~ requestOptions: ~ form',
                          form,
                        );

                        await delay(1000);

                        const otherRowSelect1 = utlFp.flow(
                          utlFp.omit([rowId!]),
                          utlFp.mapValues((item: RecordType) => item.select),
                          utlFp.values,
                          utlFp.filter(Boolean),
                        )(form?.getFieldsValue());
                        console.log(
                          '🚀 ~ file: form-async.tsx ~ line 121 ~ requestOptions: ~ otherRowSelect1',
                          otherRowSelect1,
                        );

                        return mock({
                          error: false,
                          data: [
                            {
                              label: 'A',
                              value: 'a',
                            },
                            {
                              label: 'B',
                              value: 'b',
                            },
                            {
                              label: 'C',
                              value: 'c',
                            },
                          ].filter(
                            (item) =>
                              form?.getFieldValue([rowId, 'select2']) !== item.value &&
                              !otherRowSelect1.includes(item.value),
                          ),
                        });
                      },
                    },
                  },
                  {
                    type: 'select',
                    settings: {
                      title: '下拉框2',
                      dataIndex: 'select2',
                      valueEnums: {
                        a: 'A',
                        b: 'B',
                        c: 'C',
                      },
                    },
                  },
                ],
                addable: {},
              },
            },
          ],
        }}
      ></OSForm>
      <OSTrigger
        type="button"
        settings={{
          type: 'primary',
          text: '验证',
        }}
        onClick={async () => {
          await formRef.current?.validate();
        }}
      />
    </OSProviderWrapper>
  );
};

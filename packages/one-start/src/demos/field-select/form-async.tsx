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
                dataIndex: 'select1',
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
                title: '下拉框2',
                dataIndex: 'select2',
                showSearch: true,
                rules: [
                  ({ getFieldValue }) => ({
                    validateTrigger: [],
                    validator: async (rule, val) => {
                      if (val == null) {
                        return Promise.resolve();
                      }
                      const select1Val = getFieldValue('select1');
                      if (select1Val === val) {
                        return Promise.reject(new Error('和 select1 重复了'));
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
                    ].filter((item) => form?.getFieldValue('select1') !== item.value),
                  });
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
                    settings: {
                      title: '下拉框1',
                      dataIndex: 'select1',
                      valueEnums: {
                        a: 'A',
                        b: 'B',
                        c: 'C',
                      },
                    },
                  },
                  {
                    type: 'select',
                    settings: ({ rowId }) => ({
                      title: '下拉框2',
                      dataIndex: 'select2',
                      showSearch: true,
                      rules: [
                        ({ getFieldValue }) => ({
                          validateTrigger: [],
                          validator: async (rule, val) => {
                            if (val == null) {
                              return Promise.resolve();
                            }
                            const select1Val = getFieldValue([rowId!, 'select1']);
                            if (select1Val === val) {
                              return Promise.reject(new Error('和 select1 重复了'));
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
                          utlFp.mapValues((item: RecordType) => item.select1),
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
                              form?.getFieldValue([rowId, 'select1']) !== item.value &&
                              !otherRowSelect1.includes(item.value),
                          ),
                        });
                      },
                    },
                  },
                ],
                addable: {},
              },
            },
            {
              type: 'select',
              settings: {
                title: '下拉框3',
                dataIndex: 'select3',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
              },
            },
            {
              type: 'select',
              dependencies: ['select3'],
              settings: ({ form }) => ({
                title: '下拉框4',
                dataIndex: 'select4',
                showSearch: true,
                params: {
                  select3: form.getFieldValue('select3'),
                },
                readonly: true,
                valueLinkage: {
                  linkage: (changedValues) => {
                    if ('select3' in changedValues) {
                      return {
                        select4: changedValues.select3,
                      };
                    }
                    return {};
                  },
                },
              }),
              requests: {
                requestOptions: async ({ params }) => {
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
                    ].filter((item) => params?.select3 === item.value),
                  });
                },
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

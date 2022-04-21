import type { OSSearchTableType, RecordType } from '@ty-one-start/one-start';
import { OSEditableTable, OSProviderWrapper, parseTableValue } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export const rowViewable = (): Required<Required<OSSearchTableType>['settings']>['rowViewable'] => {
  return {
    formSettings: {
      wrapperCol: {
        span: 24,
      },
      fieldItems: [
        {
          type: 'layout-tabs-form',
          settings: {
            dataIndex: 'root',
            tabs: [
              {
                title: '基本信息',
                key: 'basicInformation',
              },
              {
                title: '适用对象',
                key: 'applicableObjects',
              },
            ],
            forms: {
              basicInformation: {
                settings: {
                  fieldItemSettings: {
                    labelCol: {
                      span: 3,
                    },
                    wrapperCol: {
                      span: 21,
                    },
                  },
                  fieldItems: [
                    {
                      type: 'text',
                      settings: {
                        title: '配置名称',
                        dataIndex: 'defineName',
                        colSpan: 24,
                      },
                    },
                    {
                      type: 'select',
                      settings: {
                        title: '插值方法',
                        dataIndex: 'interpolationWay',
                        colSpan: 24,
                        valueEnums: {
                          CS: 'Cubic Spline',
                          LLD: 'Log Linear DF',
                          LD: 'Linear DF',
                          LZ: 'Linear Zero',
                        },

                        initialValue: 'CS',
                      },
                    },
                    {
                      type: 'editable-table',
                      settings: {
                        title: '即期曲线',
                        dataIndex: 'curveList',
                        colSpan: 24,
                        addable: {},
                        removeable: {},
                        fieldItems: [
                          {
                            type: 'select',
                            settings: {
                              title: '参考利率',
                              dataIndex: 'referenceRateId',
                              rules: [
                                {
                                  required: true,
                                },
                              ],
                            },
                            requests: {
                              requestOptions: async () => {
                                return {
                                  error: false,
                                  data: [],
                                };
                              },
                            },
                          },
                          {
                            type: 'select',
                            settings: {
                              title: '曲线定义',
                              dataIndex: 'curveId',
                              rules: [
                                {
                                  required: true,
                                },
                              ],
                            },
                            requests: {
                              requestOptions: async ({ form, rowId }) => {
                                if (form?.getFieldValue([rowId!, 'referenceRateId']) == null)
                                  return false;
                                return {
                                  error: false,
                                  data: [],
                                };
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: 'select',
                      settings: {
                        title: '贴现类型',
                        dataIndex: 'discountType',
                        colSpan: 24,
                        valueEnums: {
                          SC: '单曲线',
                        },

                        initialValue: 'SC',
                        disabled: true,
                      },
                    },
                    {
                      type: 'textarea',
                      settings: {
                        title: '备注',
                        dataIndex: 'remark',
                        colSpan: 24,
                      },
                    },
                  ],
                },
              },
              applicableObjects: {
                settings: {
                  labelCol: {
                    span: 3,
                  },
                  wrapperCol: {
                    span: 21,
                  },
                  fieldItems: [
                    {
                      type: 'editable-table',
                      settings: {
                        title: '适用对象',
                        dataIndex: 'applyObjectList',
                        colSpan: 24,
                        addable: {},
                        removeable: {},
                        fieldItems: [
                          {
                            type: 'select',
                            settings: {
                              title: '匹配字段',
                              dataIndex: 'matchObjectType',
                              valueEnums: {
                                TRADE_BOOK: '交易簿',
                                TRADE_PARTY: '交易对手',
                                TRADE_CONTRACT: '合约',
                              },
                              initialValue: 'TRADE_BOOK',
                            },
                          },
                          {
                            type: 'select',
                            settings: {
                              title: '匹配条件',
                              dataIndex: 'matchType',
                              valueEnums: {
                                ALL: '全部',
                                CONTAIN: '包含',
                                LIKE: '模糊匹配',
                              },
                            },
                          },
                          {
                            type: 'atom',
                            dependencies: ['matchType'],
                            settings: ({ form, rowId }) => {
                              if (form.getFieldValue([rowId!, 'matchType']) === 'CONTAIN') {
                                return {
                                  title: '值',
                                  dataIndex: 'valueList',
                                  type: 'select',
                                  settings: {
                                    mode: 'multiple',
                                    showSearch: true,
                                  },
                                  requests: {
                                    requestOptions: async ({
                                      form: form_,
                                      rowId: rowId_,
                                      // searchValue = '',
                                    }) => {
                                      if (
                                        form_?.getFieldValue([rowId_!, 'matchObjectType']) == null
                                      )
                                        return false;
                                      return {
                                        error: false,
                                        data: [],
                                      };
                                    },
                                  },
                                };
                              }
                              if (form.getFieldValue([rowId!, 'matchType']) === 'ALL') {
                                return {
                                  title: '值',
                                  dataIndex: 'valueList',
                                  type: 'option',
                                  settings: {
                                    disabled: true,
                                  },
                                };
                              }
                              return {
                                title: '值',
                                dataIndex: 'valueList',
                                type: 'text',
                              };
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    },
  };
};

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>();
  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSEditableTable
        value={value}
        onChange={(e) => setValue(parseTableValue(e))}
        settings={{
          addable: {},
          removeable: {},
          fieldItems: [
            {
              type: 'select',
              settings: {
                title: 'selectA',
                dataIndex: 'selectA',
                valueEnums: {
                  a: 'a',
                  b: 'b',
                  c: 'c',
                },
              },
            },
            {
              type: 'atom',
              dependencies: ['selectA'],
              settings: ({ form, rowId }) => ({
                title: 'atom',
                dataIndex: 'atom',
                ...(form.getFieldValue([rowId!, 'selectA']) === 'a'
                  ? {
                      type: 'select',
                      requests: {
                        requestOptions: async (options) => {
                          console.log('options', options);
                          return {
                            error: false,
                            data: [
                              {
                                label: 'A',
                                value: 'a',
                              },
                            ],
                          };
                        },
                      },
                    }
                  : {
                      type: 'text',
                    }),
              }),
            },
            {
              type: 'atom',
              settings: ({ form, rowId }) => ({
                title: 'atom-readonly',
                dataIndex: 'atom',
                editable: false,
                ...(form.getFieldValue([rowId!, 'selectA']) === 'a'
                  ? {
                      type: 'select',
                      requests: {
                        requestOptions: async (options) => {
                          console.log('options', options);
                          return {
                            error: false,
                            data: [
                              {
                                label: 'A',
                                value: 'a',
                              },
                            ],
                          };
                        },
                      },
                    }
                  : {
                      type: 'text',
                    }),
              }),
            },
          ],
        }}
      ></OSEditableTable>
    </OSProviderWrapper>
  );
};

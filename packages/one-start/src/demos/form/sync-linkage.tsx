import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          valueLinkage: [
            (changedValues) => {
              if ('a' in changedValues) {
                return {
                  b: undefined,
                };
              }
              return {};
            },
            (changedValues) => {
              if ('b' in changedValues) {
                return {
                  c: undefined,
                };
              }
              return {};
            },
            (changedValues) => {
              /** 交易方向，表格内部的字段取反联动 */
              if ('d' in changedValues) {
                const dataSource = changedValues.d;
                const [first, second] = dataSource;

                const next = [
                  first,
                  {
                    ...second,
                    swapRole:
                      first.swapRole === 'FIRST_PARTY_ROLE'
                        ? 'SECOND_PARTY_ROLE'
                        : 'FIRST_PARTY_ROLE',
                    swapEquityDirection: first.swapEquityDirection === 'PAY' ? 'RECEIVE' : 'PAY',
                    swapInterestDirection:
                      first.swapInterestDirection === 'PAY' ? 'RECEIVE' : 'PAY',
                  },
                ];

                return {
                  d: next,
                };
              }
              return {};
            },
          ],
          fieldItems: [
            {
              type: 'percent',
              settings: {
                title: 'a',
                dataIndex: 'a',
              },
            },
            {
              type: 'money',
              settings: {
                title: 'b',
                dataIndex: 'b',
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
                title: 'c',
                dataIndex: 'c',
                linkagetip: [
                  '当 e 的值变化后，c 的值根据 b 的值 + 500',
                  '如果 e 的值为空，则 b 的值为 0',
                  '这里指定了 afterIndexId 为 e，因此 e 注册的联动计算结果会影响 c 注册的联动计算',
                ],
                valueLinkage: {
                  afterIndexIdRegisted: 'e',
                  linkage: (changedValues) => {
                    if ('e' in changedValues) {
                      return {
                        c: changedValues.e == null ? 0 : changedValues.e + 500,
                      };
                    }
                    return {};
                  },
                },
              },
            },
            {
              type: 'money',
              settings: {
                title: 'e',
                dataIndex: 'e',
                linkagetip: [
                  '当 b 的值变化后，根据 b 的值 + 100',
                  '如果 b 的值为空，则 b 的值为 0',
                ],
                valueLinkage: {
                  linkage: (changedValues) => {
                    if ('b' in changedValues) {
                      return {
                        e: changedValues.b == null ? 0 : changedValues.b + 100,
                      };
                    }
                    return {};
                  },
                },
              },
            },
            {
              type: 'editable-table',
              settings: {
                title: 'd',
                dataIndex: 'd',
                styles: {
                  marginBottom: 30,
                },
                rules: [
                  {
                    required: true,
                  },
                ],
                labelCol: {
                  flex: '0 0 13.888888%',
                },
                wrapperCol: {
                  flex: '1 1',
                },
                initialValue: [
                  {
                    id: '1',
                    company: '--',
                    swapRole: 'FIRST_PARTY_ROLE',
                    swapEquityDirection: 'PAY',
                    swapInterestDirection: 'RECEIVE',
                  },
                  {
                    id: '2',
                    company: '交易对手方',
                    swapRole: 'SECOND_PARTY_ROLE',
                    swapEquityDirection: 'RECEIVE',
                    swapInterestDirection: 'PAY',
                  },
                ],
                editableRowKeys: ['1'],
                fieldItems: [
                  {
                    type: 'text',
                    settings: {
                      title: '',
                      dataIndex: 'company',
                      align: 'left',
                    },
                  },
                  {
                    type: 'select',
                    settings: {
                      allowClear: false,
                      align: 'left',
                      title: '角色',
                      dataIndex: 'swapRole',
                      editable: true,
                      valueEnums: {
                        FIRST_PARTY_ROLE: '甲方',
                        SECOND_PARTY_ROLE: '乙方',
                      },
                    },
                  },
                  {
                    type: 'select',
                    settings: {
                      allowClear: false,
                      align: 'left',
                      title: '权益方向',
                      dataIndex: 'swapEquityDirection',
                      editable: true,
                      valueEnums: {
                        PAY: '支付',
                        RECEIVE: '收取',
                      },
                    },
                  },
                  {
                    type: 'select',
                    settings: {
                      allowClear: false,
                      align: 'left',
                      title: '利率方向',
                      dataIndex: 'swapInterestDirection',
                      editable: true,
                      valueEnums: {
                        PAY: '支付',
                        RECEIVE: '收取',
                      },
                    },
                  },
                ],
              },
              requests: {
                requestInitialValue: async () => {
                  await delay(1000);
                  return {
                    error: false,
                    data: [
                      {
                        id: '1',
                        company: '安信证券' ?? '--',
                        swapRole: 'FIRST_PARTY_ROLE',
                        swapEquityDirection: 'PAY',
                        swapInterestDirection: 'RECEIVE',
                      },
                      {
                        id: '2',
                        company: '交易对手方',
                        swapRole: 'SECOND_PARTY_ROLE',
                        swapEquityDirection: 'RECEIVE',
                        swapInterestDirection: 'PAY',
                      },
                    ],
                  };
                },
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

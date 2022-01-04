/* eslint-disable import/no-extraneous-dependencies */
import type { OSSearchGridAPI } from '@ty-one-start/one-start';
import { OSPage, OSProviderWrapper, OSSearchGrid } from '@ty-one-start/one-start';
import moment from 'moment';
import React, { useRef } from 'react';
import { treeData } from './tree-data-1';

const options = {
  dataIndex: 'aggregateTypes',
  typeKey: 'aggregateTypeZH',
  valueKey: 'aggregateKey',
};

const formatValue = '0,0.00';

export default () => {
  const tableRef = useRef<OSSearchGridAPI>(null);
  return (
    <OSProviderWrapper>
      <OSPage
        settings={{
          content: (
            <OSSearchGrid
              ref={tableRef}
              settings={{
                treeDatable: {
                  typeKey: options.typeKey,
                  valueKey: options.valueKey,
                },
                searchFormItemChunkSize: 3,

                highlightVerticalRow: false,
                searchFormSettings: {
                  labelCol: {
                    span: 6,
                  },
                  wrapperCol: {
                    span: 18,
                  },
                },
                fieldItems: [
                  {
                    type: 'chain-select',
                    settings: {
                      dataIndex: options.dataIndex,
                      title: '汇总方式',
                      search: 'only',
                      showSearch: true,
                      valueEnums: {
                        TRADE_BOOK: '交易簿',
                        CONTRACT: '合约',
                        VARIETIES: '品种',
                        COUNTER_PARTY: '交易对手',
                      },
                      initialValue: ['TRADE_BOOK', 'VARIETIES'],
                    },
                  },
                  {
                    type: 'date',
                    settings: {
                      title: '计算日',
                      dataIndex: 'valuationDate',
                      search: 'only',
                      initialValue: moment(),
                      disabledDate: (current: moment.Moment) => {
                        return current && current > moment().endOf('day');
                      },
                    },
                  },
                  {
                    type: 'select',
                    settings: {
                      title: '货币类型',
                      search: 'only',
                      dataIndex: 'currencyType',
                      valueEnums: {
                        TRADE_CURRENCY: '交易货币',
                        SETTLE_CURRENCY: '结算货币',
                      },
                      initialValue: 'TRADE_CURRENCY',
                    },
                  },
                  {
                    type: 'date',
                    settings: {
                      title: '计算日',
                      dataIndex: 'valuationDate',
                    },
                  },
                  {
                    type: 'text',
                    settings: {
                      title: '资产类别',
                      dataIndex: 'assetClass',
                    },
                  },
                  {
                    type: 'text',
                    settings: {
                      title: '资产子类别',
                      dataIndex: 'assetSubclass',
                    },
                  },
                  {
                    type: 'text',
                    settings: {
                      title: '标的类型',
                      dataIndex: 'instrumentType',
                    },
                  },
                  {
                    type: 'text',
                    settings: {
                      title: '标的乘数',
                      dataIndex: 'multiplier',
                    },
                  },
                  {
                    type: 'text',
                    settings: {
                      title: '标的物价格',
                      dataIndex: 'instrumentPrice',
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '估值汇率',
                      dataIndex: 'todayExchangeRate',
                      format: '0,0.[00000000]',
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: 'Delta手数',
                      dataIndex: 'delta',
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: 'DeltaCash',
                      dataIndex: 'deltaCash',
                    },
                  },
                  {
                    type: 'group',
                    settings: {
                      title: '我方支付权益',
                    },
                    children: [
                      {
                        type: 'digit',
                        settings: {
                          title: '多头-持仓数量',
                          dataIndex: 'payLongCurrentAmount',
                        },
                      },
                      {
                        type: 'digit',
                        settings: {
                          title: '多头-存续名义本金',
                          dataIndex: 'payLongNotionalAmount',
                          format: formatValue,
                        },
                      },
                      {
                        type: 'digit',
                        settings: {
                          title: '空头-持仓数量',
                          dataIndex: 'payShortCurrentAmount',
                        },
                      },
                      {
                        type: 'digit',
                        settings: {
                          title: '空头-存续名义本金',
                          dataIndex: 'payShortNotionalAmount',
                          format: formatValue,
                        },
                      },
                    ],
                  },

                  {
                    type: 'group',
                    settings: {
                      title: '我方收取权益',
                    },
                    children: [
                      {
                        type: 'digit',
                        settings: {
                          title: '多头-持仓数量',
                          dataIndex: 'receiveLongCurrentAmount',
                        },
                      },
                      {
                        type: 'digit',
                        settings: {
                          title: '多头-存续名义本金',
                          dataIndex: 'receiveLongNotionalAmount',
                          format: formatValue,
                        },
                      },
                      {
                        type: 'digit',
                        settings: {
                          title: '空头-持仓数量',
                          dataIndex: 'receiveShortCurrentAmount',
                        },
                      },
                      {
                        type: 'digit',
                        settings: {
                          title: '空头-存续名义本金',
                          dataIndex: 'receiveShortNotionalAmount',
                          format: formatValue,
                        },
                      },
                    ],
                  },

                  {
                    type: 'digit',
                    settings: {
                      title: '当日实现权益总盈亏',
                      dataIndex: 'newlyRealizedIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日实现权益盈亏',
                      dataIndex: 'newlyRealizedEquityIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日调仓盈亏',
                      dataIndex: 'newlyRealizedAdjustIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日平仓盈亏',
                      dataIndex: 'newlyRealizedSettleIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日实现分红盈亏',
                      dataIndex: 'newlyRealizedDividendIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '累计实现权益总盈亏',
                      dataIndex: 'accumulateRealizedIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '累计实现权益盈亏',
                      dataIndex: 'accumulateRealizedEquityIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '累计实现分红盈亏',
                      dataIndex: 'accumulateRealizedDividendIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '待实现权益总盈亏',
                      dataIndex: 'unrealizedEquityIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日待实现权益总盈亏变化',
                      dataIndex: 'newlyUnrealizedIncomeChange',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '权益总盈亏',
                      dataIndex: 'equityIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日权益总盈亏',
                      dataIndex: 'newlyEquityIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日实现利率收益',
                      dataIndex: 'dailyRealizedInterestIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '累计实现利率收益',
                      dataIndex: 'accumulateRealizedInterestIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '待实现利率收益',
                      dataIndex: 'unRealizedInterestIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日产生平仓费用',
                      dataIndex: 'newlyUnwindFee',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '累计产生平仓费用',
                      dataIndex: 'realizedUnwindFee',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '利率总盈亏',
                      dataIndex: 'accumulateInterestIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日利率总盈亏',
                      dataIndex: 'newlyInterestIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '总盈亏',
                      dataIndex: 'accumulateIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'digit',
                    settings: {
                      title: '当日总盈亏',
                      dataIndex: 'newlyIncome',
                      format: formatValue,
                    },
                  },
                  {
                    type: 'text',
                    settings: {
                      title: '报错信息',
                      dataIndex: 'errorMessage',
                      ellipsisTooltip: true,
                    },
                  },
                  {
                    type: 'date',
                    settings: {
                      title: '更新时间',
                      dataIndex: 'executeDateTime',
                      format: 'YYYY-MM-DD HH:mm:ss',
                    },
                  },
                ],
              }}
              requests={{
                requestDataSource: async () => {
                  return {
                    error: false,
                    data: {
                      page: treeData?.page,
                      total: treeData?.totalCount,
                    },
                  };
                },
              }}
            />
          ),
        }}
      />
    </OSProviderWrapper>
  );
};

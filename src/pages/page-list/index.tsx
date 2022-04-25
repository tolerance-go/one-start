import { QIANKUN_GLOBAL } from '@/constants/login';
import { OSPage, OSProviderWrapper, OSSearchTable } from '@ty-one-start/one-start';
import { Typography } from 'antd';
import utl from 'lodash';
import { mock } from 'mockjs';
import moment from 'moment';
import React from 'react';

export const tableKey = 'pageRiskReports';

const PageList = () => {
  return (
    <OSProviderWrapper>
      <OSPage
        settings={{
          breadcrumb: [
            {
              path: '',
              name: '报告中心',
            },
            ...(window[QIANKUN_GLOBAL.FROM_PAGE]
              ? [
                  {
                    path: '',
                    name: '收益互换',
                  },
                ]
              : []),
          ],
          title: '风控报告',
          content: (
            <OSSearchTable
              settings={{
                tableKey,
                highlightBadge: {
                  warning: {},
                  error: {},
                },
                searchFormItemChunkSize: 3,
                searchTempldateable: {
                  templateNameKey: 'templateName',
                  templateManagementTableFieldItems: [
                    {
                      type: 'text',
                      settings: {
                        title: '模板名称',
                        dataIndex: 'templateName',
                      },
                    },
                    {
                      type: 'select',
                      settings: {
                        title: '模板类型',
                        dataIndex: 'templateType',
                        valueEnums: {
                          PERSONAL: '个人',
                          PUBLIC: '公共',
                        },
                      },
                    },
                    {
                      type: 'date',
                      settings: {
                        title: '最近保存时间',
                        dataIndex: 'updateTime',
                        format: 'YYYY-MM-DD HH:mm:ss',
                      },
                    },
                  ],
                  createFormFieldItems: [
                    {
                      type: 'text',
                      settings: {
                        title: '模板名称',
                        dataIndex: 'templateName',
                      },
                    },
                    {
                      type: 'select',
                      settings: {
                        title: '模板类型',
                        dataIndex: 'templateType',
                        valueEnums: {
                          PERSONAL: '个人',
                          PUBLIC: '公共',
                        },
                        initialValue: 'PERSONAL',
                      },
                    },
                  ],
                  editFormFieldItems: [
                    {
                      type: 'text',
                      settings: {
                        title: '模板名称',
                        dataIndex: 'templateName',
                      },
                    },
                    {
                      type: 'select',
                      settings: {
                        title: '模板类型',
                        dataIndex: 'templateType',
                        valueEnums: {
                          PERSONAL: '个人',
                          PUBLIC: '公共',
                        },
                      },
                    },
                  ],
                },
                highlightVerticalRow: false,
                searchFormSettings: {
                  labelCol: {
                    span: 4,
                  },
                  wrapperCol: {
                    span: 20,
                  },
                },
                fieldItems: [
                  {
                    type: 'text',
                    settings: {
                      dataIndex: 'riskObjectListTable',
                      title: '汇总方式',
                      defaultWidth: 400,
                    },
                    render: ({ rowData }) => {
                      return (
                        <span>
                          <Typography.Text type="secondary">
                            {rowData?.riskObjectZh}:
                          </Typography.Text>{' '}
                          <Typography.Text>{rowData?.objectName}</Typography.Text>
                        </span>
                      );
                    },
                  },
                  {
                    type: 'chain-select',
                    settings: {
                      dataIndex: 'riskObjectList',
                      title: '汇总方式',
                      search: 'only',
                      showSearch: true,
                      rules: [
                        {
                          validator: (rule, val: string[]) => {
                            if (!val) {
                              return Promise.resolve();
                            }
                            if (
                              utl.intersection(['FWCONTRACT', 'CONTRACT', 'ALLCONTRACT'], val)
                                .length > 1
                            ) {
                              return Promise.reject(
                                new Error('合约、框架合约和一般合约不能同时选择'),
                              );
                            }
                            if (utl.intersection(['DEALBOOK', 'OBJECTTYPE'], val).length > 1) {
                              return Promise.reject(new Error('交易簿和标的品种不能同时选择'));
                            }
                            return Promise.resolve();
                          },
                        },
                        {
                          validator: (rule, val: string[]) => {
                            if (!val) {
                              return Promise.resolve();
                            }
                            const index = val.findIndex((item) => item === 'OBJECTMATTER');
                            if (index !== -1 && index !== val.length - 1) {
                              return Promise.reject(new Error('标的物需最后选择'));
                            }
                            return Promise.resolve();
                          },
                        },
                      ],
                      tooltip: [],
                      initialValue: ['FWCONTRACT', 'OBJECTMATTER'],
                    },
                    requests: {
                      requestOptions: async () => {},
                    },
                  },
                  {
                    type: 'date',
                    settings: {
                      title: '报告日期',
                      dataIndex: 'reportDateForm',
                      search: 'only',
                      initialValue: moment(),
                    },
                  },
                  {
                    type: 'date',
                    settings: {
                      title: '报告日期',
                      dataIndex: 'reportDate',
                      sorter: true,
                    },
                  },
                  {
                    type: 'text',
                    settings: ({ rowData }) => ({
                      title: '标的方向',
                      dataIndex: ['direction', 'value'],
                      align: 'center',
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.direction?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.direction?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.direction?.message,
                    }),
                  },
                  {
                    type: 'money',
                    settings: ({ rowData }) => ({
                      title: '名义本金',
                      defaultWidth: 250,
                      dataIndex: ['priceValue', 'value'],
                      unit: rowData?.priceValue?.valueCurrency,
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.priceValue?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.priceValue?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.priceValue?.message,
                    }),
                  },
                  {
                    type: 'select',
                    settings: {
                      title: '币种',
                      search: 'only',
                      dataIndex: 'currency',
                      initialValue: 'CNY',
                    },
                    requests: {
                      requestOptions: async () => {},
                    },
                  },
                  {
                    type: 'select',
                    dependencies: ['riskObjectList'],
                    settings: ({ form }) => ({
                      hide: !form.getFieldValue('riskObjectList')?.includes('PARTY'),
                      title: '交易对手',
                      dataIndex: 'partyCodeList',
                      search: 'only',
                      mode: 'multiple',
                      showSearch: true,
                      tooltip: ['当汇总方式包含交易对手时展示'],
                    }),
                    requests: {
                      requestOptions: async ({ searchValue }) => {
                        return {
                          error: false,
                          data: [],
                        };
                      },
                    },
                  },
                  {
                    type: 'select',
                    dependencies: ['riskObjectList'],
                    settings: ({ form }) => ({
                      hide: !form.getFieldValue('riskObjectList')?.includes('DEALBOOK'),
                      title: '交易簿',
                      dataIndex: 'resourceNameList',
                      search: 'only',
                      mode: 'multiple',
                      showSearch: true,
                      tooltip: ['当汇总方式包含交易簿时展示'],
                    }),
                    requests: {
                      requestOptions: async ({ searchValue }) => {
                        return {
                          error: false,
                          data: [],
                        };
                      },
                    },
                  },
                  {
                    type: 'select',
                    dependencies: ['riskObjectList'],
                    settings: ({ form }) => {
                      const intersect = utl.intersection(
                        ['FWCONTRACT', 'CONTRACT', 'ALLCONTRACT'],
                        form.getFieldValue('riskObjectList'),
                      );
                      return {
                        hide: intersect.length === 0,
                        title: '合约编号',
                        dataIndex: 'frameContractList',
                        search: 'only',
                        mode: 'multiple',
                        showSearch: true,
                        params: {
                          riskObjectValue: intersect?.[0],
                        },
                        tooltip: ['当汇总方式包含合约、一般合约、框架合约时展示'],
                      };
                    },
                    requests: {
                      requestOptions: async ({ searchValue, params }) => {
                        return {
                          error: false,
                          data: [],
                        };
                      },
                    },
                  },
                  {
                    type: 'money',
                    settings: ({ rowData }) => ({
                      title: '市值',
                      defaultWidth: 250,
                      dataIndex: ['marketValue', 'value'],
                      unit: rowData?.marketValue?.valueCurrency,
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.marketValue?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.marketValue?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.marketValue?.message,
                    }),
                  },
                  {
                    type: 'text',
                    settings: ({ rowData }) => ({
                      title: '名义本金集中度(%)',
                      dataIndex: ['priceConcentrationRatio', 'value'],
                      align: 'right',
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.priceConcentrationRatio?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.priceConcentrationRatio?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.priceConcentrationRatio?.message,
                    }),
                  },
                  {
                    type: 'text',
                    settings: ({ rowData }) => ({
                      title: '市值集中度(%)',
                      dataIndex: ['marketConcentrationRatio', 'value'],
                      align: 'right',
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.marketConcentrationRatio?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.marketConcentrationRatio?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.marketConcentrationRatio?.message,
                    }),
                  },
                  {
                    type: 'text',
                    settings: ({ rowData }) => ({
                      title: '多空敞口(名义本金)(%)',
                      align: 'right',
                      dataIndex: ['notionalExposure', 'value'],
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.notionalExposure?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.notionalExposure?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.notionalExposure?.message,
                    }),
                  },
                  {
                    type: 'text',
                    settings: ({ rowData }) => ({
                      title: '多空敞口(市值)(%)',
                      align: 'right',
                      dataIndex: ['marketExposure', 'value'],
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.marketExposure?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.marketExposure?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.marketExposure?.message,
                    }),
                  },
                  {
                    type: 'text',
                    settings: ({ rowData }) => ({
                      title: '多空相关性(%)',
                      align: 'right',
                      dataIndex: ['lsCorrelation', 'value'],
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.lsCorrelation?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.lsCorrelation?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.lsCorrelation?.message,
                    }),
                  },
                  {
                    type: 'digit',
                    settings: ({ rowData }) => ({
                      title: '股票只数',
                      dataIndex: ['stockNums', 'value'],
                      decimalData: false,
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.stockNums?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.stockNums?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.stockNums?.message,
                    }),
                  },
                  {
                    type: 'text',
                    settings: ({ rowData }) => ({
                      title: '股票类型',
                      dataIndex: ['stockTypes', 'value'],
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.stockTypes?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.stockTypes?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.stockTypes?.message,
                    }),
                  },
                  {
                    type: 'text',
                    settings: ({ rowData }) => ({
                      title: '逆回购期限',
                      dataIndex: ['reverseLimits', 'value'],
                      highlight: (rowData_) => ({
                        type: (() => {
                          if (rowData_?.reverseLimits?.tag === 2) {
                            return 'error';
                          }
                          if (rowData_?.reverseLimits?.tag === 1) {
                            return 'warning';
                          }
                          return undefined;
                        })(),
                      }),
                      cellTooltip: rowData?.reverseLimits?.message,
                    }),
                  },
                  {
                    type: 'text',
                    settings: {
                      defaultWidth: 250,
                      title: '备注',
                      dataIndex: 'remarkInfo',
                      ellipsisTooltip: true,
                    },
                  },
                ],
              }}
              requests={{
                requestDataSource: async ({ current, pageSize, search, order, orderBy }) => {
                  const sortmap = {
                    ascend: 'ASC',
                    descend: 'DESC',
                  };

                  return mock({
                    error: false,
                    data: {
                      'page|20': [
                        {
                          id: '@id',
                        },
                      ],
                      total: 100,
                    },
                  });
                },
              }}
            />
          ),
        }}
      />
    </OSProviderWrapper>
  );
};

PageList.name = 'pageList';

export default PageList;

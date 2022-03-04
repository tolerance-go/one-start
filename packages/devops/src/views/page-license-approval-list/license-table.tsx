import type { OSTableAPI } from '@ty-one-start/one-start';
import { OSActionsOperate } from '@ty-one-start/one-start';
import { OSTrigger, OSDialog } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSSearchTable } from '@ty-one-start/one-start';
import { Typography } from '@ty/antd';
import delay from 'delay';
import Mock, { mock, Random } from 'mockjs';
import React, { useRef } from 'react';
import { data } from './constants';

export default () => {
  const tableRef = useRef<OSTableAPI>(null);

  return (
    <OSProviderWrapper>
      <OSSearchTable
        ref={tableRef}
        settings={{
          rowActions: [
            <OSDialog
              type="popconfirm"
              settings={{
                title: '确认通过吗？',
              }}
              requests={{
                requestAfterConfirm: async () => {
                  await delay(1000);
                  tableRef.current?.reload();
                },
              }}
            >
              <OSTrigger
                type="button"
                settings={{
                  text: '通过',
                  type: 'link',
                  size: 'small',
                }}
              />
            </OSDialog>,
            <OSActionsOperate
              settings={{
                modalTitle: '确认拒绝吗？',
                triggerButtonText: '确认',
                triggerButtonSettings: {
                  text: '拒绝',
                  type: 'link',
                  size: 'small',
                },
                alert: {
                  type: 'warning',
                  message: (
                    <div>
                      <Typography.Paragraph>1. xxxxxxxx。</Typography.Paragraph>
                      <div>2. xxxxxxxx。</div>
                    </div>
                  ),
                },
                formSettings: {
                  fieldItems: [
                    {
                      type: 'textarea',
                      settings: {
                        dataIndex: 'textarea',
                        labelCol: {
                          span: 0,
                        },
                        wrapperCol: {
                          span: 24,
                        },
                        styles: {
                          marginBottom: 0,
                        },
                        placeholder: '请输入拒绝理由（选填）',
                      },
                    },
                  ],
                },
              }}
              requests={{
                requestAfterConfirm: async ({ values }) => {
                  console.log(values);
                  await delay(1000);
                  tableRef.current?.reload();
                  return false;
                },
              }}
            />,
          ],
          rowViewable: {
            formSettings: {
              labelCol: {
                span: 6,
              },
              wrapperCol: {
                span: 18,
              },
              fieldItems: [
                {
                  type: 'switch',
                  settings: {
                    title: '是否开启验证码登录',
                    dataIndex: '是否开启验证码登录',
                  },
                },
                {
                  type: 'tree-select',
                  settings: {
                    title: '页面权限',
                    dataIndex: '页面权限',
                    multiple: true,
                    showSearch: true,
                  },
                  requests: {
                    requestOptions: async () => {
                      return {
                        error: false,
                        data,
                      };
                    },
                  },
                },
                {
                  type: 'tree-select',
                  settings: {
                    title: '功能权限',
                    dataIndex: '功能权限',
                    multiple: true,
                    showSearch: true,
                  },
                  requests: {
                    requestOptions: async () => {
                      return {
                        error: false,
                        data: [
                          {
                            label: '功能1',
                            value: '功能1',
                            children: [
                              {
                                label: '功能1-1',
                                value: '功能1-1',
                              },
                            ],
                          },
                          {
                            label: '功能2',
                            value: '功能2',
                            children: [
                              {
                                label: '功能2-1',
                                value: '功能2-1',
                              },
                              {
                                label: '功能2-2',
                                value: '功能2-2',
                              },
                            ],
                          },
                        ],
                      };
                    },
                  },
                },
              ],
            },
          },
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
          fieldItems: [
            {
              type: 'text',
              settings: {
                title: 'license 申请记录 ID',
                dataIndex: 'licenseId',
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
            {
              type: 'text',
              settings: {
                title: '申请用户',
                dataIndex: '申请用户',
                search: true,
              },
            },
            {
              type: 'select',
              settings: {
                title: '审核状态',
                dataIndex: '审核状态',
                search: true,
                valueEnums: {
                  pending: '审核中',
                  done: '完成',
                },
              },
            },
            {
              type: 'date',
              settings: {
                title: '创建时间',
                dataIndex: '创建时间',
              },
            },
          ],
        }}
        requests={{
          requestDataSource: async (options) => {
            console.log(options);

            await delay(1000);

            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    licenseId: () => Random.id(),
                    申请用户: () => Random.cname(),
                    审核状态: () => Random.pick(['pending', 'done']),
                    创建时间: () => Random.datetime(),
                  },
                ],
                total: 20,
              },
            });
          },
          requestViewRowData: async () => {
            await delay(1000);

            return mock({
              error: false,
              data: {
                是否开启验证码登录: '@boolean',
                页面权限: [
                  '场外期权-试定价',
                  '场外期权-交易簿记',
                  '收益互换-交易簿记',
                  '持仓管理',
                  '场内持仓',
                  '场外期权-交易列表',
                  '场外期权-生命周期概览',
                  '收益互换-生命周期概览',
                  '收益互换-合约列表',
                  '收益互换-框架合约列表',
                  '收益互换-框架合约成交流水',
                  '客户管理',
                  '机构信息',
                  '客户信息',
                  '销售管理',
                  '邮箱管理',
                  '邮箱发送管理',
                  '客户管理配置',
                  '码表管理',
                  '黑名单管理',
                  '客户回访',
                ],
                功能权限: ['功能1', '功能1-1', '功能2', '功能2-1', '功能2-2'],
              },
            });
          },
          requestCreateTemplate: async (options) => {
            console.log(options);

            // const { error } =
            //   await SwapServices.ContractSearchTemplateService.swapSaveContractSearchTemplate({}, {
            //     /** 模板名称 */
            //     templateName: options.values?.templateName,
            //     /** 查询类型 */
            //     searchType: 'test',
            //     /** 模板类型 */
            //     templateType: options.values?.templateType,
            //     contractCacheFrontData: options.searchValues ?? {},
            //   } as SwapServiceAPI.SwapContractSearchTemplateDTO);

            // return error;

            await delay(1000);

            return false;
          },
          requestTemplateDataSource: async (options) => {
            console.log(options);
            await delay(1000);

            // const { error, data } =
            //   await SwapServices.ContractSearchTemplateService.swapQueryContractSearchTemplateByPage(
            //     {
            //       page: options.current - 1,
            //       pageSize: options.pageSize,
            //     },
            //     {
            //       searchType: 'test',
            //     },
            //   );
            // return {
            //   error,
            //   data: {
            //     page: data?.page,
            //     total: data?.totalCount,
            //   },
            // };

            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    templateName: () => Random.word(),
                    templateType: () => Random.word(),
                    updateTime: () => Random.datetime(),
                  },
                ],
                total: 20,
              },
            });
          },
          requestApplayTemplateSearchValues: async (options) => {
            console.log('options', options);
            await delay(1000);

            // const { error, data } =
            //   await SwapServices.ContractSearchTemplateService.searchSearchTemplateByTemplateId(
            //     {
            //       id: options.id,
            //     },
            //     {
            //       searchType: 'test',
            //     },
            //   );
            // return {
            //   error,
            //   data: {
            //     searchValues: data?.contractCacheFrontData,
            //   },
            // };

            return {
              error: false,
              data: {
                searchDataSource: {},
                columnsVisibleMap: {},
                columnsFixedsMap: {},
                columnsOrders: {},
              },
            };
          },
          requestUpdateSearchTempldate: async (options) => {
            console.log('options', options);
            await delay(1000);
            return {
              error: false,
            };
          },
        }}
      ></OSSearchTable>
    </OSProviderWrapper>
  );
};

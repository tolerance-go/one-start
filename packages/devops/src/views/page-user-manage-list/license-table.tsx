import type { OSTableAPI } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSSearchTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock, { mock, Random } from 'mockjs';
import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import LicenseCreateTrigger from './license-create-trigger';
import ResetPasswordTrigger from './reset-password-trigger';

export default () => {
  const tableRef = useRef<OSTableAPI>(null);

  return (
    <OSProviderWrapper>
      <OSSearchTable
        ref={tableRef}
        settings={{
          rowActions: (options) => {
            const { rowData } = options;
            return [<ResetPasswordTrigger rowInfo={rowData} tableAPIRef={tableRef} />];
          },
          rowEditable: {
            formType: 'form',
            formSettings: {
              labelCol: {
                span: 6,
              },
              wrapperCol: {
                span: 18,
              },
              fieldItems: [
                {
                  type: 'text',
                  settings: {
                    title: '用户名',
                    dataIndex: 'username',
                    readonly: true,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'switch',
                  settings: {
                    title: '是否开启证书审批',
                    dataIndex: '是否开启证书审批',
                  },
                },
                {
                  type: 'select',
                  settings: {
                    title: '审批对象',
                    dataIndex: 'approval',
                    mode: 'multiple',
                    showSearch: true,
                  },
                  requests: {
                    requestOptions: async () => {
                      return {
                        error: false,
                        data: [
                          {
                            label: '审批组1',
                            value: uuid(),
                          },
                          {
                            label: '审批组2',
                            value: uuid(),
                          },
                        ],
                      };
                    },
                  },
                },
              ],
            },
          },
          rowRemoveable: {},
          actions: {
            left: [<LicenseCreateTrigger tableAPIRef={tableRef} />],
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
                title: '用户名',
                dataIndex: 'username',
                search: true,
              },
            },
            {
              type: 'select',
              settings: {
                title: '是否开启证书审批',
                dataIndex: '是否开启证书审批',
                valueEnums: {
                  true: '是',
                  false: '否',
                },
              },
            },
            {
              type: 'select',
              settings: {
                title: '审批对象',
                dataIndex: 'approval',
                showSearch: true,
                search: true,
              },
              requests: {
                requestOptions: async () => {
                  return {
                    error: false,
                    data: [
                      {
                        label: '审批组1',
                        value: uuid(),
                      },
                      {
                        label: '审批组2',
                        value: uuid(),
                      },
                    ],
                  };
                },
              },
            },
            {
              type: 'date',
              settings: {
                title: '更新时间',
                dataIndex: 'updateTime',
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
                'page|50': [
                  {
                    id: '@id',
                    username: () => Random.cname(),
                    是否开启证书审批: Random.pick(['true', 'false']),
                    approval: () => Random.pick(['审批组1', '审批组2']),
                    updateTime: () => Random.datetime(),
                  },
                ],
                total: 50,
              },
            });
          },
          requestRowEditData: async () => {
            await delay(1000);

            return mock({
              error: false,
              data: {
                是否开启证书审批: '@boolean',
                username: () => Random.cname(),
                approval: () => Random.pick(['审批组1', '审批组2']),
              },
            });
          },
          requestRemoveRow: async () => {
            await delay(1000);
            return {
              error: false,
            };
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

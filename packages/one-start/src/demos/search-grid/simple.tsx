/**
 * transform: true
 */
import { OSProviderWrapper, OSSearchGrid } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock, { Random } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSSearchGrid
        settings={{
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
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                rules: [
                  {
                    required: true,
                  },
                ],
                search: true,
                sorter: true,
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
                search: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
                search: true,
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
                search: true,
              },
            },
            {
              type: 'group',
              settings: {
                title: '分组1',
              },
              children: [
                {
                  type: 'digit',
                  settings: {
                    title: 'digit',
                    dataIndex: 'digit',
                    search: true,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'date',
                  settings: {
                    title: 'date',
                    dataIndex: 'date',
                    search: true,
                  },
                },
                {
                  type: 'date-range',
                  settings: {
                    title: 'date-range',
                    dataIndex: 'date-range',
                    search: true,
                  },
                },
                {
                  type: 'select',
                  settings: {
                    title: 'select',
                    dataIndex: 'select',
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
                    title: 'select-search',
                    dataIndex: 'select-search',
                    showSearch: true,
                    mode: 'multiple',
                  },
                  requests: {
                    requestOptions: async () => {
                      await delay(1000);
                      return Promise.resolve({
                        error: false,
                        data: [
                          { value: 'a', label: 'A' },
                          { value: 'b', label: 'B' },
                          { value: 'c', label: 'C' },
                        ],
                      });
                    },
                  },
                },
              ],
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
                    money: () => Random.integer(),
                    percent: () => Random.integer(),
                    text: () => Random.word(),
                    textarea: () => Random.paragraph(),
                    digit: () => Random.integer(),
                    date: () => Random.date(),
                    'date-range': () => [Random.date(), Random.date()],
                    select: () => Random.pick(['a', 'b', 'c']),
                    'select-search': () => Random.pick(['a', 'b', 'c']),
                  },
                ],
                total: 20,
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
                searchDataSource: Mock.mock({
                  money: () => Random.integer(),
                  percent: () => Random.integer(),
                  text: () => Random.word(),
                }),
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
      ></OSSearchGrid>
    </OSProviderWrapper>
  );
};

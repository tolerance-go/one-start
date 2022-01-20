import {
  OSBattleTableUpload,
  OSDialog,
  OSProviderWrapper,
  OSSourceTable,
  OSTrigger,
} from '@ty-one-start/one-start';
import delay from 'delay';
import { mock, Random } from 'mockjs';
import moment from 'moment';
import React from 'react';
import { CreateTemplate } from './create-template';
import { rowEditableSettings } from './row-editable-settings';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTrigger
        type="dropdown"
        settings={{
          text: '成交流水导入',
          type: 'primary',
          overlayZIndex: 950,
          menu: [
            {
              type: 'item-group',
              text: '自定义模板',
              children: [
                {
                  key: 'simple',
                  text: (
                    <OSBattleTableUpload
                      settings={{
                        modalTitle: '简版成交流水导入',
                        triggerText: '流水导入',
                        triggerSettings: {
                          type: 'text',
                          plain: true,
                          block: true,
                        },
                        fieldItems: [
                          {
                            type: 'text',
                            settings: {
                              dataIndex: 'contractCode',
                              title: '框架合约编号',
                            },
                          },
                          {
                            type: 'text',
                            key: 'BCT_STD_TRANSACTION',
                            settings: {
                              dataIndex: 'BCT_STD_TRANSACTION',
                              title: '成交流水',
                            },
                          },
                        ],
                        attachmentFieldKeys: {
                          BCT_STD_TRANSACTION: {
                            baseDataIndex: 'contractCode',
                            suffix: '.xlsx',
                          },
                        },
                        extraFormFieldItems: [
                          {
                            type: 'date',
                            settings: {
                              dataIndex: 'tradeDate',
                              title: '交易日期',
                            },
                          },
                          {
                            type: 'select',
                            settings: {
                              dataIndex: '模板选择',
                              title: '模板选择',
                            },
                          },
                        ],
                        extraFormInitialValues: {
                          tradeDate: moment(),
                        },
                      }}
                    />
                  ),
                },
                {
                  text: (
                    <OSDialog
                      type="modal-operation"
                      settings={{
                        type: 'info',
                        title: '模板映射',
                        width: '80%',
                        content: (
                          <OSSourceTable
                            settings={{
                              fieldItems: [
                                {
                                  type: 'text',
                                  settings: {
                                    title: '模板名称',
                                    dataIndex: '模板名称',
                                    fixed: 'left',
                                  },
                                },
                                {
                                  type: 'date',
                                  settings: {
                                    title: '更新日期',
                                    dataIndex: '更新日期',
                                    format: 'YYYY-MM-DD HH:mm',
                                  },
                                },
                                {
                                  type: 'group',
                                  settings: {
                                    title: '映射规则',
                                    dataIndex: '映射规则',
                                  },
                                  children: [
                                    {
                                      type: 'text',
                                      settings: {
                                        title: '发生日期',
                                        dataIndex: '发生日期',
                                        ellipsisTooltip: true,
                                      },
                                    },
                                    {
                                      type: 'text',
                                      settings: {
                                        title: '标的物代码',
                                        dataIndex: '标的物代码',
                                        ellipsisTooltip: true,
                                      },
                                    },
                                    {
                                      type: 'text',
                                      settings: {
                                        title: '方向',
                                        dataIndex: '方向',
                                        ellipsisTooltip: true,
                                      },
                                    },
                                    {
                                      type: 'text',
                                      settings: {
                                        title: '成交价格',
                                        dataIndex: '成交价格',
                                        ellipsisTooltip: true,
                                      },
                                    },
                                    {
                                      type: 'text',
                                      settings: {
                                        title: '成交数量',
                                        dataIndex: '成交数量',
                                        ellipsisTooltip: true,
                                      },
                                    },
                                    {
                                      type: 'text',
                                      settings: {
                                        title: '成交金额',
                                        dataIndex: '成交金额',
                                        ellipsisTooltip: true,
                                      },
                                    },
                                    {
                                      type: 'text',
                                      settings: {
                                        title: '标的利率',
                                        dataIndex: '标的利率',
                                        ellipsisTooltip: true,
                                      },
                                    },
                                    {
                                      type: 'text',
                                      settings: {
                                        title: '其他手续费',
                                        dataIndex: '其他手续费',
                                        ellipsisTooltip: true,
                                      },
                                    },
                                  ],
                                },
                              ],
                              rowEditable: rowEditableSettings(),
                              rowRemoveable: {},
                              actions: () => [<CreateTemplate />],
                            }}
                            requests={{
                              requestDataSource: async () => {
                                return mock({
                                  data: {
                                    'page|20': [
                                      {
                                        模板名称: () => Random.word(),
                                        更新日期: () => moment(Random.date()),
                                        映射规则: () => Random.paragraph(1, 2),
                                        发生日期: () => Random.paragraph(1, 2),
                                        标的物代码: () => Random.paragraph(1, 2),
                                        方向: () => Random.paragraph(1, 2),
                                        成交价格: () => Random.paragraph(1, 2),
                                        成交数量: () => Random.paragraph(1, 2),
                                        成交金额: () => Random.paragraph(1, 2),
                                        标的利率: () => Random.paragraph(1, 2),
                                        其他手续费: () => Random.paragraph(1, 2),
                                      },
                                    ],
                                    total: 100,
                                  },
                                  error: false,
                                });
                              },
                              requestSaveRowData: async (options) => {
                                console.log(options);
                                await delay(1000);
                                return false;
                              },
                              requestRowEditData: async (options) => {
                                console.log('options', options);
                                await delay(1000);
                                return {
                                  error: false,
                                  data: {
                                    tab1: {
                                      sheet名称: '234234',
                                      起始单元格: '234234',
                                      终止单元格: '234234',
                                      模板文件: [
                                        {
                                          url: '',
                                          name: 'asdfasdf',
                                        },
                                      ],
                                    },
                                    tab2: {
                                      模板名称: 'asdfasf',
                                      placeholders: [
                                        {
                                          label: '+',
                                          value: '+',
                                          raw: true,
                                        },
                                        {
                                          label: '-',
                                          value: '-',
                                          raw: true,
                                        },
                                        {
                                          label: 'label1',
                                          value: 'label1',
                                        },
                                        {
                                          label: 'label2',
                                          value: 'label2',
                                        },
                                        {
                                          label: 'label3',
                                          value: 'label3',
                                        },
                                        {
                                          label: 'label4',
                                          value: 'label4',
                                        },
                                      ],
                                    },
                                  },
                                };
                              },
                            }}
                          />
                        ),
                      }}
                    >
                      <OSTrigger
                        type="button"
                        settings={{
                          text: '模板映射',
                          type: 'text',
                          plain: true,
                          block: true,
                        }}
                      />
                    </OSDialog>
                  ),
                },
              ],
            },
          ],
        }}
      ></OSTrigger>
    </OSProviderWrapper>
  );
};

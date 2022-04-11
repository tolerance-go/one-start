import { FundOutlined } from '@ant-design/icons';
import type { RecordType } from '@ty-one-start/one-start';
import { OSEditableTable, OSProviderWrapper, OSSourceTable } from '@ty-one-start/one-start';
import delay from 'delay';
import produce from 'immer';
import Mock, { mock, Random } from 'mockjs';
import moment from 'moment';
import React, { useState } from 'react';
import { OSTrigger, parseTableValue } from '../../components';
import type { OSSourceTableType } from '../../typings';

const createRowData = () => {
  return Mock.mock({
    id: () => Mock.Random.id(),
    text: () => Mock.Random.word(),
    textarea: () => Mock.Random.paragraph(),
    digit: () => Mock.Random.integer(),
    date: () => Mock.Random.date(),
    'date-range': () => [Mock.Random.date(), Mock.Random.date()],
    money: '@integer',
    percent: '@integer',
    money2: '@integer',
    percent2: '@integer',
    select: () => 'a',
    select2: () => 'a',
  });
};

let pageData = Mock.mock({
  error: false,
  data: {
    'page|20': [
      {
        id: () => Mock.Random.id(),
        text: () => Mock.Random.word(),
        textarea: () => Mock.Random.paragraph(),
        digit: () => Mock.Random.integer(),
        date: () => Mock.Random.date(),
        'date-range': () => [Mock.Random.date(), Mock.Random.date()],
        money: '@integer',
        percent: '@integer',
        money2: '@integer',
        percent2: '@integer',
        select: () => 'a',
        select2: () => 'a',
      },
    ],
    total: 100,
  },
});

const EditableTable1 = (
  props: Parameters<Required<Required<OSSourceTableType>['slots']>['renderCategorizableTable']>[0],
) => {
  const [value, setValue] = useState<RecordType[] | undefined>(
    props.node.children?.map((item) => ({ id: item.key })),
  );

  return (
    <OSEditableTable
      value={value}
      onChange={(next) => setValue(parseTableValue(next))}
      settings={{
        fieldItems: [
          {
            type: 'text',
            settings: {
              title: 'text',
              dataIndex: 'text',
              editable: true,
              autoFocus: true,
            },
          },
          {
            type: 'date',
            settings: {
              title: 'date',
              dataIndex: 'date',
              editable: true,
            },
          },
          {
            type: 'digit',
            settings: {
              title: 'digit',
              dataIndex: 'digit',
              editable: true,
            },
          },
        ],
        addable: {},
        removeable: {},
      }}
      requests={{
        requestNewRecordData: async ({ rowData }) => {
          props.apisRef.current?.insertCategorizableTreeChildLatest?.(props.node.key, {
            title: 'leafxxxxxx',
            key: rowData.id,
          });

          return {
            error: false,
            data: {
              ...rowData,
            },
          };
        },
        requestRemoveRecord: async ({ rowId }) => {
          props.apisRef.current?.deleteCategorizableTreeChild?.(props.node.key, (item) => {
            return item.key === rowId;
          });

          return {
            error: false,
          };
        },
        // requestDataSource: async () => {
        //   return {
        //     error: false,
        //     data: {
        //       page: node.children?.map((item) => ({ id: item.key })),
        //       total: node.children?.length,
        //     },
        //   };
        // },
      }}
    ></OSEditableTable>
  );
};

export default () => {
  return (
    <OSProviderWrapper>
      <OSSourceTable
        settings={{
          searchFormItemChunkSize: 3,
          categorizable: {
            listTitle: '自定义标题',
            autoSelectFirst: true,
            actions: [
              <OSTrigger
                type="button"
                settings={{
                  type: 'primary',
                  text: '导入',
                  size: 'small',
                }}
              />,
              <OSTrigger
                type="button"
                settings={{
                  type: 'primary',
                  text: '导出',
                  size: 'small',
                }}
              />,
            ],
          },
          rowRemoveable: {},
          rowViewable: {
            formSettings: {
              labelCol: { span: 4 },
              wrapperCol: { span: 20 },
              fieldItems: [
                {
                  type: 'money',
                  settings: {
                    title: 'money',
                    dataIndex: 'money',
                  },
                },
                {
                  type: 'digit',
                  settings: {
                    title: 'digit',
                    dataIndex: 'digit',
                  },
                },
                {
                  type: 'percent',
                  settings: {
                    title: 'percent',
                    dataIndex: 'percent',
                  },
                },
                {
                  type: 'date',
                  settings: {
                    title: 'date',
                    dataIndex: 'date',
                  },
                },
                {
                  type: 'date-range',
                  settings: {
                    title: 'date-range',
                    dataIndex: 'date-range',
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
                    title: 'selectMultiple',
                    dataIndex: 'selectMultiple',
                    valueEnums: {
                      a: 'A',
                      b: 'B',
                      c: 'C',
                    },
                    mode: 'multiple',
                  },
                },
                {
                  type: 'text',
                  settings: {
                    title: 'text',
                    dataIndex: 'text',
                  },
                },
                {
                  type: 'textarea',
                  settings: {
                    title: 'textarea',
                    dataIndex: 'textarea',
                  },
                },
              ],
            },
          },
          rowEditable: {
            formType: 'form',
            formSettings: {
              labelCol: { span: 4 },
              wrapperCol: { span: 20 },
              fieldItems: [
                {
                  type: 'money',
                  settings: {
                    title: 'money',
                    dataIndex: 'money',
                  },
                },
                {
                  type: 'digit',
                  settings: {
                    title: 'digit',
                    dataIndex: 'digit',
                  },
                },
                {
                  type: 'percent',
                  settings: {
                    title: 'percent',
                    dataIndex: 'percent',
                  },
                },
                {
                  type: 'date',
                  settings: {
                    title: 'date',
                    dataIndex: 'date',
                  },
                },
                {
                  type: 'date-range',
                  settings: {
                    title: 'date-range',
                    dataIndex: 'date-range',
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
                    title: 'selectMultiple',
                    dataIndex: 'selectMultiple',
                    valueEnums: {
                      a: 'A',
                      b: 'B',
                      c: 'C',
                    },
                    mode: 'multiple',
                  },
                },
                {
                  type: 'text',
                  settings: {
                    title: 'text',
                    dataIndex: 'text',
                  },
                },
                {
                  type: 'textarea',
                  settings: {
                    title: 'textarea',
                    dataIndex: 'textarea',
                  },
                },
              ],
            },
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
                fixed: 'left',
                resizeable: false,
                search: true,
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
          ],
          defaultActiveFirstRow: {
            type: 'view',
          },
        }}
        slots={{
          renderCategorizableTable: ({ node, apisRef }) => {
            if (node.key === '0-1') {
              return <EditableTable1 node={node} apisRef={apisRef} />;
            }
            return null;
          },
        }}
        requests={{
          requestCategorizableData: async () => {
            await delay(1000);

            const treeData = [
              {
                title: 'parent 1',
                key: '0-0',
                selectable: false,
                children: [
                  {
                    title: 'parent 1-0',
                    key: '0-0-0',
                    children: [
                      {
                        title: 'leaf',
                        key: '0-0-0-0',
                        icon: <FundOutlined />,
                      },
                      {
                        title: 'multiple line title',
                        key: '0-0-0-1',
                      },
                      {
                        title: 'leaf',
                        key: '0-0-0-2',
                      },
                    ],
                  },
                  {
                    title: 'parent 1-1',
                    key: '0-0-1',
                    children: [
                      {
                        title: 'leaf',
                        key: '0-0-1-0',
                      },
                    ],
                  },
                  {
                    title: 'parent 1-2',
                    key: '0-0-2',
                    children: [
                      {
                        title: 'leaf',
                        key: '0-0-2-0',
                      },
                      {
                        title: 'leaf',
                        key: '0-0-2-1',
                      },
                    ],
                  },
                ],
              },
              {
                title: 'parent 2',
                key: '0-1',
                children: [
                  {
                    title: 'leaf',
                    key: '0-1-0-0',
                  },
                  {
                    title: 'leaf',
                    key: '0-1-0-1',
                  },
                ],
              },
              {
                title: 'parent 23',
                key: '0-13',
                children: [
                  {
                    title: 'leaf',
                    key: '0-1-0-03',
                  },
                  {
                    title: 'leaf',
                    key: '0-1-0-13',
                  },
                  {
                    title: 'leaf',
                    key: '0-1-0-043',
                  },
                  {
                    title: 'leaf',
                    key: '0-1-0-413',
                  },
                  {
                    title: 'leaf',
                    key: '0-1-0-0443',
                  },
                  {
                    title: 'leaf',
                    key: '0-1-0-4413',
                  },
                ],
              },
            ];

            return {
              error: false,
              data: {
                data: treeData,
              },
            };
          },
          requestDataSource: async (options) => {
            if (options.params?.activeNode == null) return false;

            console.log('requestDataSource', options);

            await delay(1000);

            return {
              ...pageData,
            };
          },
          requestRemoveRow: async (options) => {
            console.log('requestRemoveRow', options);
            await delay(1000);

            pageData = produce(pageData, (draft: RecordType) => {
              draft.data.page.splice(options.rowIndex, 1);
              draft.data.page.push(createRowData());
            });

            return {
              error: false,
              data: {
                message: '自定义删除成功消息',
              },
            };
          },
          requestViewRowData: async (options) => {
            console.log('requestViewRowData', options);
            await delay(1500);

            return mock({
              error: false,
              data: {
                money: () => Random.integer(),
                digit: () => Random.integer(),
                percent: () => Random.integer(),
                date: () => moment(),
                'date-range': () => [moment(), moment()],
                select: () => Random.pick(['a', 'b', 'c']),
                selectMultiple: ['a', 'b'],
                text: () => Random.word(),
                textarea: () => Random.paragraph(),
              },
            });
          },
          requestRowEditData: async (options) => {
            console.log('requestViewRowData', options);
            await delay(1500);

            return mock({
              error: false,
              data: {
                money: () => Random.integer(),
                digit: () => Random.integer(),
                percent: () => Random.integer(),
                date: () => moment(),
                'date-range': () => [moment(), moment()],
                select: () => Random.pick(['a', 'b', 'c']),
                selectMultiple: ['a', 'b'],
                text: () => Random.word(),
                textarea: () => Random.paragraph(),
              },
            });
          },
          requestSaveRowData: async (options) => {
            console.log('requestSaveRowData', options);
            await delay(1500);
            return false;
          },
        }}
      ></OSSourceTable>
    </OSProviderWrapper>
  );
};

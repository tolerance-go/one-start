import type { RecordType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSSourceTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock, { mock, Random } from 'mockjs';
import moment from 'moment';
import React from 'react';
import produce from 'immer';

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

export default () => {
  return (
    <OSProviderWrapper>
      <OSSourceTable
        settings={{
          searchFormItemChunkSize: 3,
          panelable: {},
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
        requests={{
          requestDataSource: async (options) => {
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
                message: '???????????????????????????',
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

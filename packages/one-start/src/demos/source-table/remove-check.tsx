import React from 'react';
import { OSProviderWrapper, OSSourceTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock from 'mockjs';

const apis = {
  allData: Mock.mock({
    'page|21': [
      {
        id: '@id',
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
  }).page,
  deleteItem(id: string) {
    this.allData = this.allData.filter((item: { id: string }) => item.id !== id);
  },
  search(props: { current: number; pageSize: number }) {
    const currData = [...this.allData].slice(
      (props.current - 1) * props.pageSize,
      (props.current - 1) * props.pageSize + props.pageSize,
    );
    return {
      error: false,
      data: {
        page: currData,
        total: this.allData.length,
      },
    };
  },
};

export default () => {
  return (
    <OSProviderWrapper>
      <OSSourceTable
        settings={{
          pagination: {
            defaultCurrent: 2,
          },
          rowRemoveable: {},
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
          ],
        }}
        requests={{
          requestDataSource: async (options) => {
            await delay(1000);
            return { ...apis.search(options) };
          },
          requestRemoveRow: async ({ rowData }) => {
            apis.deleteItem(rowData.id);
            await delay(1000);
            return {
              error: false,
              data: {
                message: '自定义删除成功消息',
              },
            };
          },
        }}
      ></OSSourceTable>
    </OSProviderWrapper>
  );
};

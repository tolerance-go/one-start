import { OSProviderWrapper, OSSourceTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSSourceTable
        settings={{
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
            console.log(options);

            await delay(1000);

            return Mock.mock({
              error: false,
              data: {
                'page|20': [
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
                total: () => Mock.Random.integer(50, 100),
              },
            });
          },
          requestRemoveRow: async (options) => {
            console.log(options);
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

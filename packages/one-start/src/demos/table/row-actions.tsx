import { OSProviderWrapper, OSTable } from '@ty-one-start/one-start';
import { Button } from 'antd';
import delay from 'delay';
import Mock from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          rowActions: {
            width: 200,
            columnTitle: '自定义操作',
            render: (options) => {
              console.log(options);
              return [
                <Button type="link">btn1</Button>,
                <Button type="link">btn2</Button>,
                <Button type="link">btn3</Button>,
              ];
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
                configable: true,
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
                configable: true,
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
                configable: true,
              },
            },
            {
              type: 'date-range',
              settings: {
                title: 'date-range',
                dataIndex: 'date-range',
                configable: true,
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
        }}
      ></OSTable>
    </OSProviderWrapper>
  );
};

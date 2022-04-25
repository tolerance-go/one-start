/**
 * debug: true
 * title: 各种 dialog 存在时的 zindex 优先级
 * iframe: 700
 */
import { OSProviderWrapper, OSSourceTable } from '@ty-one-start/one-start';
import request from '@ty-one-start/request';
import { Typography } from 'antd';
import delay from 'delay';
import Mock, { mock, Random } from 'mockjs';
import moment from 'moment';
import React, { useEffect } from 'react';

export default () => {
  const init = async () => {
    request('/always-error', {
      notificationSettings: {
        duration: 60 * 60,
      },
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <OSProviderWrapper>
      <Typography.Text>
        tooltip zindex 高于通知框，因为 tooltip 可能出现在通知框内部的，并且 tooltip
        也是用户主动行为 感受上不会觉得被遮住了 反过来才会觉得被挡住了
      </Typography.Text>
      <OSSourceTable
        settings={{
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
            console.log('requestDataSource', options);

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
            console.log('requestRemoveRow', options);
            await delay(1000);
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

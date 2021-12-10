import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { mock, Random } from 'mockjs';
import moment from 'moment';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                readonly: true,
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
                readonly: true,
              },
            },
            {
              type: 'percent',
              settings: {
                title: 'percent',
                dataIndex: 'percent',
                readonly: true,
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
                readonly: true,
              },
            },
            {
              type: 'date-range',
              settings: {
                title: 'date-range',
                dataIndex: 'date-range',
                readonly: true,
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
                readonly: true,
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
                readonly: true,
              },
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
                readonly: true,
              },
            },
            {
              type: 'textarea',
              settings: {
                title: 'textarea',
                dataIndex: 'textarea',
                readonly: true,
              },
            },
            {
              type: 'chain-select',
              settings: {
                title: 'chain-select',
                dataIndex: 'chain-select',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
                readonly: true,
              },
            },
          ],
        }}
        requests={{
          requestDataSource: async () => {
            return Promise.resolve(
              mock({
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
                  'chain-select': ['a', 'b', 'c'],
                },
              }),
            );
          },
        }}
      />
    </OSProviderWrapper>
  );
};

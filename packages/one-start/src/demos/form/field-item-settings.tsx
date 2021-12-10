import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { mock, Random } from 'mockjs';
import moment from 'moment';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          fieldItemSettings: {
            readonly: true,
          },
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'money',
                dataIndex: 'money',
                readonly: false,
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
                readonly: false,
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
                readonly: false,
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
                },
              }),
            );
          },
        }}
      />
    </OSProviderWrapper>
  );
};

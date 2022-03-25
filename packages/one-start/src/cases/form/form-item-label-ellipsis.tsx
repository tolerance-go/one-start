/**
 * debug: true
 * title: label 显示不全展示省略
 */
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { mock, Random } from 'mockjs';
import moment from 'moment';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <div style={{ width: 500, border: '1px solid' }}>
        <OSForm
          settings={{
            labelCol: { span: 2 },
            wrapperCol: { span: 22 },
            fieldItems: [
              {
                type: 'money',
                settings: {
                  title: 'moneymoneymoney',
                  dataIndex: 'money',
                  labelCol: { span: 12 },
                  wrapperCol: { span: 12 },
                },
              },
              {
                type: 'digit',
                settings: {
                  title: 'digitdigitdigitdigitdigitdigit',
                  dataIndex: 'digit',
                  labelCol: { span: 12 },
                  wrapperCol: { span: 12 },
                },
              },
              {
                type: 'percent',
                settings: {
                  title: 'percentpercentpercentpercentpercentpercent',
                  dataIndex: 'percent',
                  labelCol: { span: 12 },
                  wrapperCol: { span: 12 },
                },
              },
              {
                type: 'date',
                settings: {
                  title: 'datedatedatedatedatedate',
                  dataIndex: 'date',
                  readonly: true,
                  labelCol: { span: 12 },
                  wrapperCol: { span: 12 },
                  labelAlign: 'left',
                },
              },
              {
                type: 'date-range',
                settings: {
                  title: 'datedatedatedatedatedate-range',
                  dataIndex: 'date-range',
                  readonly: true,
                },
              },
              {
                type: 'select',
                settings: {
                  title: 'selectselectselectselectselectselect',
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
                  title:
                    'selectMultipleselectMultipleselectMultipleselectMultipleselectMultipleselectMultiple',
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
                  title: 'texttexttexttexttexttext',
                  dataIndex: 'text',
                  readonly: true,
                },
              },
              {
                type: 'textarea',
                settings: {
                  title: 'textareatextareatextareatextareatextareatextarea',
                  dataIndex: 'textarea',
                  readonly: true,
                },
              },
              {
                type: 'chain-select',
                settings: {
                  title: 'chainchainchainchainchainchain-select',
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
      </div>
    </OSProviderWrapper>
  );
};

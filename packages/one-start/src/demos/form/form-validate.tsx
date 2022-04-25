import type { OSFormAPI } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Col, Row } from 'antd';
import { mock, Random } from 'mockjs';
import moment from 'moment';
import React, { useRef } from 'react';

export default () => {
  const formRef = useRef<OSFormAPI>(null);
  return (
    <OSProviderWrapper>
      <OSForm
        ref={formRef}
        settings={{
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
              },
            },
            {
              type: 'attachment-table',
              settings: {
                title: 'attachment-table',
                dataIndex: 'attachment-table',
                fieldItems: [
                  {
                    type: 'text',
                    settings: {
                      dataIndex: ['file', 'name'],
                      title: 'fileName',
                      editable: false,
                    },
                  },
                  {
                    type: 'text',
                    settings: {
                      dataIndex: ['file', 'size'],
                      title: 'fileSize',
                      editable: false,
                    },
                  },
                  {
                    type: 'text',
                    settings: {
                      dataIndex: ['file', 'type'],
                      title: 'fileType',
                      editable: false,
                    },
                  },
                ],
              },
            },
          ],
        }}
        requests={{
          requestInitialValues: async () => {
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
      <Row>
        <Col>
          <OSTrigger
            type="button"
            settings={{
              text: 'validate',
              type: 'primary',
            }}
            requests={{
              requestAfterClick: async () => {
                const { error, data } = (await formRef.current?.validate()) ?? {};
                console.log(error, data);
              },
            }}
          />
        </Col>
      </Row>
    </OSProviderWrapper>
  );
};

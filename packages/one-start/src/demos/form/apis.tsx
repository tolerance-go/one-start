/* eslint-disable no-alert */
import type { OSFormAPI } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import moment from 'moment';
import React, { useRef } from 'react';
import { useDemoSettings } from '../../../../../hooks/use-demo-settings';

export default () => {
  const formRef = useRef<OSFormAPI>(null);

  const { settingForm } = useDemoSettings({
    fieldItems: [
      {
        type: 'custom',
        settings: {
          title: 'apis',
          dataIndex: 'apis',
          element: (
            <Space>
              <OSTrigger
                type="button"
                settings={{
                  type: 'link',
                  size: 'small',
                  text: 'getFieldsValue',
                }}
                onClick={() => {
                  alert(JSON.stringify(formRef.current?.getFieldsValue(), null, 2));
                }}
              />
              <OSTrigger
                type="button"
                settings={{
                  type: 'link',
                  size: 'small',
                  text: 'getDataSource',
                }}
                onClick={() => {
                  alert(JSON.stringify(formRef.current?.getDataSource(), null, 2));
                }}
              />
              <OSTrigger
                type="button"
                settings={{
                  type: 'link',
                  size: 'small',
                  text: 'getFieldsValue 包括 hide',
                }}
                onClick={() => {
                  alert(JSON.stringify(formRef.current?.getFieldsValue(true), null, 2));
                }}
              />
            </Space>
          ),
        },
      },
    ],
  });
  return (
    <OSProviderWrapper>
      {settingForm}
      <OSForm
        ref={formRef}
        settings={{
          fieldItems: [
            {
              type: 'switch',
              settings: {
                title: 'hide',
                dataIndex: 'hide',
              },
            },
            {
              type: 'text',
              dependencies: ['hide'],
              settings: ({ form }) => ({
                title: 'text-hide',
                dataIndex: 'text-hide',
                hide: form.getFieldValue('hide'),
                initialValue: 'xxxx',
              }),
            },
            {
              type: 'text',
              settings: {
                title: 'text',
                dataIndex: 'text',
                initialValue: 'xxxx',
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
              type: 'date',
              settings: {
                title: 'date-with-str-inital',
                dataIndex: 'date-with-str-inital',
                initialValue: '2020-01-01',
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date-with-moment-inital',
                dataIndex: 'date-with-moment-inital',
                initialValue: moment(),
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

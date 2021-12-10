import { OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSTrigger
          type="button"
          settings={{
            type: 'link',
            text: '上传',
            tooltip: '上传后缀限制提示',
            upload: {
              suffixs: ['.xlsx'],
              multiple: true,
              maxCount: 10,
            },
          }}
          requests={{
            requestAfterClick: async () => {
              alert('noop');
            },
            requestBeforeUpload: async (params) => {
              console.log('params', params);
              await delay(1000);
            },
          }}
        ></OSTrigger>

        <OSTrigger
          type="button"
          settings={{
            plain: true,
            type: 'link',
            text: '上传',
            tooltip: '上传后缀限制提示',
            upload: {
              suffixs: ['.xlsx'],
              multiple: true,
              maxCount: 10,
            },
          }}
          requests={{
            requestAfterClick: async () => {
              alert('noop');
            },
            requestBeforeUpload: async (params) => {
              console.log('params', params);
              await delay(1000);
            },
          }}
        ></OSTrigger>

        <OSTrigger
          type="button"
          settings={{
            text: '上传',
            tooltip: '上传后缀限制提示',
            upload: {
              suffixs: ['.xlsx'],
              multiple: true,
              maxCount: 10,
            },
          }}
          requests={{
            requestBeforeUpload: async (params) => {
              console.log('params', params);
              await delay(1000);
            },
          }}
        ></OSTrigger>

        <OSTrigger
          type="dropdown"
          settings={{
            text: '下拉',
            trigger: ['click'],
            menu: [
              {
                text: '上传',
                upload: {
                  suffixs: ['.xlsx'],
                  multiple: true,
                  maxCount: 10,
                },
              },
            ],
          }}
        ></OSTrigger>
      </Space>
    </OSProviderWrapper>
  );
};

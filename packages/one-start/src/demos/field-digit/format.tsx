import { OSDigitField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSDigitField
          mode="edit"
          settings={{
            format: '0,0',
          }}
        ></OSDigitField>
        <OSDigitField value={10000} mode="read"></OSDigitField>
        <OSDigitField
          value={10000}
          mode="read"
          settings={{
            format: '0,0.0000',
          }}
        ></OSDigitField>
      </Space>
    </OSProviderWrapper>
  );
};

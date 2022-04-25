import { OSOptionField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <span>option-field:</span>
        <OSOptionField></OSOptionField>
      </Space>
    </OSProviderWrapper>
  );
};

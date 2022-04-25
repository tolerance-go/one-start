import type { OSChainSelectFieldValueType } from '@ty-one-start/one-start';
import { OSChainSelectField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import { mock } from 'mockjs';
import React, { useState } from 'react';

const valueEnums = mock({
  a: '@word',
  b: '@word',
  c: '@word',
});

export default () => {
  const [value, setValue] = useState<OSChainSelectFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSChainSelectField
          mode="edit"
          value={value}
          onChange={setValue}
          settings={{
            valueEnums,
          }}
        ></OSChainSelectField>
        <OSChainSelectField
          mode="read"
          value={value}
          onChange={setValue}
          settings={{
            valueEnums,
          }}
        ></OSChainSelectField>
      </Space>
    </OSProviderWrapper>
  );
};

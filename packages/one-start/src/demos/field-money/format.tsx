import { OSMoneyField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useState } from 'react';
import type { OSMoneyFieldValueType } from '@ty-one-start/one-start';

export default () => {
  const [value, setValue] = useState<OSMoneyFieldValueType | undefined>(10000);

  return (
    <OSProviderWrapper>
      <Space>
        <OSMoneyField mode="edit" value={value} onChange={setValue}></OSMoneyField>
        <OSMoneyField mode="read" text={value}></OSMoneyField>
      </Space>
    </OSProviderWrapper>
  );
};

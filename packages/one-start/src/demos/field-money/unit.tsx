import type { OSMoneyFieldValueType } from '@ty-one-start/one-start';
import { OSMoneyField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSMoneyFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space>
        <OSMoneyField
          value={value}
          onChange={setValue}
          mode="edit"
          settings={{
            unit: 'OTHER',
          }}
        ></OSMoneyField>
        <OSMoneyField
          text={10000}
          mode="read"
          settings={{
            unit: 'OTHER2',
          }}
        ></OSMoneyField>
      </Space>
    </OSProviderWrapper>
  );
};

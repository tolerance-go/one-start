import { OSProviderWrapper, OSSelectField, OSSelectFieldValueType } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSSelectFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSSelectField
          mode="edit"
          value={value}
          onChange={setValue}
          settings={{
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
          }}
        ></OSSelectField>
        <OSSelectField
          mode="read"
          value={value}
          onChange={setValue}
          settings={{
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
          }}
        ></OSSelectField>
      </Space>
    </OSProviderWrapper>
  );
};

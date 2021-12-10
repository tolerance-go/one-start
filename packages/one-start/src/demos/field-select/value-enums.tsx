import { OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSSelectField
          mode="edit"
          settings={{
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
          }}
        ></OSSelectField>
        <OSSelectField
          // value="a"
          mode="read"
          settings={{
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
          }}
          text="a"
        ></OSSelectField>
      </Space>
    </OSProviderWrapper>
  );
};

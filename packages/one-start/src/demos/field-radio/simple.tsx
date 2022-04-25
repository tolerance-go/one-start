import { OSRadioField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSRadioField
          value={value}
          onChange={(e) => setValue(e?.target.value)}
          mode="edit"
          settings={{
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
          }}
        ></OSRadioField>
        <OSRadioField
          value={value}
          mode="read"
          settings={{
            valueEnums: {
              a: 'A',
              b: 'B',
              c: 'C',
            },
          }}
        ></OSRadioField>
      </Space>
    </OSProviderWrapper>
  );
};

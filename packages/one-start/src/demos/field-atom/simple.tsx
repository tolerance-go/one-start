import type { OSFieldValueType } from '@ty-one-start/one-start';
import { OSAtomField, OSProviderWrapper, parseFieldChangeEvent } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSAtomField
          value={value}
          onChange={(event) => setValue(parseFieldChangeEvent(event))}
          mode="edit"
          settings={{
            type: 'select',
            settings: {
              valueEnums: {
                a: 'A',
              },
            },
          }}
        ></OSAtomField>
        <OSAtomField
          value={value}
          mode="read"
          settings={{
            type: 'select',
            settings: {
              valueEnums: {
                a: 'A',
              },
            },
          }}
        ></OSAtomField>
      </Space>
    </OSProviderWrapper>
  );
};

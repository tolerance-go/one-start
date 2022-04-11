import type { OSTransferFieldType, OSTransferFieldValueType } from '@ty-one-start/one-start';
import { OSTransferField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import delay from 'delay';
import React, { useState } from 'react';

const mockData: Required<OSTransferFieldType>['settings']['source'] = [];
// eslint-disable-next-line no-plusplus
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
  });
}

export default () => {
  const [value, setValue] = useState<OSTransferFieldValueType>();

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSTransferField
          value={value}
          onChange={(e) => setValue(e)}
          mode="edit"
          // settings={{
          //   source: mockData,
          // }}
          requests={{
            requestSource: async () => {
              await delay(1000);
              return {
                error: false,
                data: mockData,
              };
            },
          }}
        ></OSTransferField>
        <OSTransferField
          settings={{
            source: mockData,
          }}
          value={value}
          mode="read"
        ></OSTransferField>
      </Space>
    </OSProviderWrapper>
  );
};

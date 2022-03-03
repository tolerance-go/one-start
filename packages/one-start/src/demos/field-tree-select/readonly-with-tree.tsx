import { OSProviderWrapper, OSTreeSelectField } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSTreeSelectField
          mode="read"
          value={['a', 'b', 'a2', 'b2', 'c2']}
          settings={{
            readonlyWithTree: true,
            treeOptions: [
              {
                value: 'p',
                label: 'P',
                children: [
                  { value: 'a', label: 'A' },
                  { value: 'b', label: 'B' },
                  { value: 'c', label: 'C' },
                ],
              },
              {
                value: 'p2',
                label: 'P2',
                children: [
                  { value: 'a2', label: 'A2' },
                  { value: 'b2', label: 'B2' },
                  { value: 'c2', label: 'C2' },
                ],
              },
            ],
          }}
        ></OSTreeSelectField>
        <OSTreeSelectField
          mode="read"
          value={['a', 'b', 'a2', 'b2', 'c2']}
          settings={{
            readonlyWithTree: true,
            ...mock({
              'treeOptions|200': [
                {
                  value() {
                    return this.label;
                  },
                  label: '@word',
                },
              ],
            }),
          }}
        ></OSTreeSelectField>
      </Space>
    </OSProviderWrapper>
  );
};

/**
 * transform: true
 * desc: select-search 直接显示 value 值而非 label
 */
import { OSProviderWrapper, OSTable } from '@ty-one-start/one-start';
import delay from 'delay';
import Mock, { Random } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTable
        settings={{
          fieldItems: [
            {
              type: 'select',
              settings: {
                title: 'select',
                dataIndex: 'select',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
                search: true,
              },
            },
            {
              type: 'select',
              settings: {
                title: 'select-async',
                dataIndex: 'select-async',
                search: true,
              },
              requests: {
                requestOptions: async () => {
                  await delay(1000);
                  return Promise.resolve({
                    error: false,
                    data: [
                      { value: 'a', label: 'A' },
                      { value: 'b', label: 'B' },
                      { value: 'c', label: 'C' },
                    ],
                  });
                },
              },
            },
            {
              type: 'select',
              settings: {
                title: 'select-search',
                dataIndex: 'select-search',
                mode: 'multiple',
                showSearch: true,
                search: true,
              },
              requests: {
                requestOptions: async () => {
                  await delay(1000);
                  return Promise.resolve({
                    error: false,
                    data: [
                      { value: 'a', label: 'A' },
                      { value: 'b', label: 'B' },
                      { value: 'c', label: 'C' },
                    ],
                  });
                },
              },
            },
          ],
        }}
        requests={{
          requestDataSource: async (options) => {
            console.log(options);

            await delay(1000);

            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    'select-async': () => Random.pick(['a', 'b', 'c']),
                    select: () => Random.pick(['a', 'b', 'c']),
                    'select-search': () => Random.pick(['a', 'b', 'c']),
                  },
                ],
                total: 20,
              },
            });
          },
        }}
      ></OSTable>
    </OSProviderWrapper>
  );
};

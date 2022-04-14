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
                title: 'select-async-editable',
                dataIndex: 'select-async-editable',
                search: true,
                editable: true,
              },
              requests: {
                requestOptions: async () => {
                  console.log('request');
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
                title: 'select-async',
                dataIndex: 'select-async',
                search: true,
              },
              requests: {
                requestOptions: async () => {
                  console.log('request');
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
                title: 'select-async-showSearch-remote',
                dataIndex: 'select-async-showSearch-remote',
                mode: 'multiple',
                showSearch: true,
                search: true,
                key: 'lasdjflasdjflj',
              },
              requests: {
                requestOptions: async ({ searchValue, searchKeys }) => {
                  console.log('request', searchValue, searchKeys);
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
                title: 'select-async-showSearch-local',
                dataIndex: 'select-async-showSearch-local',
                mode: 'multiple',
                showSearch: 'local',
                search: true,
              },
              requests: {
                requestOptions: async () => {
                  console.log('request');
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
          requestDataSource: async () => {
            await delay(1000);

            return Mock.mock({
              error: false,
              data: {
                'page|20': [
                  {
                    id: '@id',
                    select: () => Random.pick(['a', 'b', 'c']),
                    'select-async-editable': () => Random.pick(['a', 'b', 'c']),
                    'select-async': () => Random.pick(['a', 'b', 'c']),
                    'select-async-showSearch-remote': () => Random.pick(['a', 'b', 'c']),
                    'select-async-showSearch-local': () => Random.pick(['a', 'b', 'c']),
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

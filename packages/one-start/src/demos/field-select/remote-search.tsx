import { OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSSelectField
        // value="a"
        mode="edit"
        settings={{
          showSearch: true,
        }}
        requests={{
          requestOptions: async ({ searchValue }) => {
            console.log('searchValue', searchValue);
            await delay(1000);
            return mock({
              error: false,
              'data|1-100': [
                {
                  label: '@word',
                  value: '@word',
                },
              ],
            });
          },
        }}
      ></OSSelectField>
    </OSProviderWrapper>
  );
};

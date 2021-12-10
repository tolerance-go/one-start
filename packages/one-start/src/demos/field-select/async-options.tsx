import { OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSSelectField
        mode="edit"
        requests={{
          requestOptions: async () => {
            await delay(5000);
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

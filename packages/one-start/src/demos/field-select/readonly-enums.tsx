import { OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock, Random } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSSelectField
        mode="read"
        value={[0, 1, 2, 3, 4]}
        settings={{
          mode: 'multiple',
        }}
        requests={{
          requestOptions: async () => {
            await delay(1000);
            return mock({
              error: false,
              'data|1-100': [
                {
                  label: '@word',
                  value: () => Random.increment(),
                },
              ],
            });
          },
        }}
      ></OSSelectField>
    </OSProviderWrapper>
  );
};

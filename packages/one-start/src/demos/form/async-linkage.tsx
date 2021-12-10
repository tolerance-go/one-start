import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          valueAsyncLinkage: {
            parallel: {
              'a-b': async (changedValues) => {
                if ('a' in changedValues) {
                  await delay(2000);
                  return {
                    b: changedValues.a,
                  };
                }
                return {};
              },
              'a-b-long': async (changedValues) => {
                if ('a' in changedValues) {
                  await delay(3000);
                  return {
                    b: changedValues.a * 2,
                  };
                }
                return {};
              },
            },
            serial: [
              async (changedValues) => {
                if ('a' in changedValues) {
                  await delay(1000);
                  return {
                    b: changedValues.a * 10,
                  };
                }
                return {};
              },
              async (changedValues) => {
                if ('b' in changedValues) {
                  await delay(1000);
                  return {
                    c: changedValues.b * 10,
                  };
                }
                return {};
              },
            ],
          },
          fieldItems: [
            {
              type: 'money',
              settings: {
                title: 'a',
                dataIndex: 'a',
              },
            },
            {
              type: 'money',
              settings: {
                title: 'b',
                dataIndex: 'b',
              },
            },
            {
              type: 'money',
              settings: {
                title: 'c',
                dataIndex: 'c',
              },
            },
            {
              type: 'money',
              settings: {
                title: 'd',
                dataIndex: 'd',
              },
            },
            {
              type: 'money',
              settings: {
                title: 'e',
                dataIndex: 'e',
                linkagetip: ['当 f 的值变化后，e 的值会设置为 200 + f'],
                valueAsyncLinkage: {
                  serial: {
                    afterIndexIdRegisted: 'f',
                    linkage: async (changedValues) => {
                      if ('f' in changedValues) {
                        return {
                          e: changedValues.f + 200,
                        };
                      }
                      return {};
                    },
                  },
                },
              },
            },
            {
              type: 'money',
              settings: {
                title: 'f',
                dataIndex: 'f',
                linkagetip: ['当 a 变化后，f 的值设置为 100 + a'],
                valueAsyncLinkage: {
                  serial: {
                    linkage: async (changedValues) => {
                      if ('a' in changedValues) {
                        return {
                          f: changedValues.a + 100,
                        };
                      }
                      return {};
                    },
                  },
                },
              },
            },
            {
              type: 'money',
              settings: {
                title: 'g',
                dataIndex: 'g',
                linkagetip: ['当 a 变化后，g 的值设置为 1000 + a'],
                valueAsyncLinkage: {
                  parallel: async (changedValues) => {
                    if ('a' in changedValues) {
                      await delay(3000);
                      return {
                        g: changedValues.a + 1000,
                      };
                    }
                    return {};
                  },
                },
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

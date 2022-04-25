/**
 * desc:
 *  修改 a 后，1s 后 b 扩大为 a 的 10 倍，1.5s 后 b 扩大为 a 的 100 倍，因为异步计算，1.5s
 *  最后返回的数据会被保留，最终 b 为 a 的 100 倍，但是 serial 的存在导致结果是 2.5s 后，a，b，c 值都一样（serial 也被作为一项 parallel）
 */

import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { Divider } from 'antd';
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
                  await delay(1000);
                  return {
                    b: changedValues.a * 10,
                  };
                }
                return {};
              },
              'a-b-long': async (changedValues) => {
                if ('a' in changedValues) {
                  await delay(1500);
                  return {
                    b: changedValues.a * 100,
                  };
                }
                return {};
              },
            },
            serial: [
              async (changedValues) => {
                if ('a' in changedValues) {
                  await delay(2000);
                  return {
                    b: changedValues.a,
                  };
                }
                return {};
              },
              async (changedValues) => {
                if ('b' in changedValues) {
                  await delay(500);
                  return {
                    c: changedValues.b,
                  };
                }
                return {};
              },
            ],
          },
          fieldItems: [
            {
              type: 'digit',
              settings: {
                title: 'a',
                dataIndex: 'a',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'b',
                dataIndex: 'b',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'c',
                dataIndex: 'c',
              },
            },
          ],
        }}
      ></OSForm>
      <Divider />
      <OSForm
        settings={{
          valueAsyncLinkage: {
            parallel: {
              'a-b': async (changedValues) => {
                if ('a' in changedValues) {
                  await delay(1000);
                  return {
                    b: changedValues.a * 10,
                  };
                }
                return {};
              },
              'a-b-long': async (changedValues) => {
                if ('a' in changedValues) {
                  await delay(1500);
                  return {
                    b: changedValues.a * 100,
                  };
                }
                return {};
              },
            },
            serial: [
              async (changedValues) => {
                if ('a' in changedValues) {
                  await delay(500);
                  return {
                    b: changedValues.a,
                  };
                }
                return {};
              },
              async (changedValues) => {
                if ('b' in changedValues) {
                  await delay(500);
                  return {
                    c: changedValues.b,
                  };
                }
                return {};
              },
            ],
          },
          fieldItems: [
            {
              type: 'digit',
              settings: {
                title: 'a',
                dataIndex: 'a',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'b',
                dataIndex: 'b',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'c',
                dataIndex: 'c',
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

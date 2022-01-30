/**
 * desc: 修改 a 后，b 扩大为 a 的 10 倍，接着 c 扩大为 b 的 10 倍；d 中列中的枚举始终保持相反
 */
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          valueLinkage: [
            (changedValues) => {
              if ('a' in changedValues) {
                return {
                  b: changedValues.a * 10,
                };
              }
              return {};
            },
            (changedValues) => {
              if ('b' in changedValues) {
                return {
                  c: changedValues.b * 10,
                };
              }
              return {};
            },
            (changedValues) => {
              /** 交易方向，表格内部的字段取反联动 */
              if ('d' in changedValues) {
                const dataSource = changedValues.d;
                const [first, second] = dataSource;

                const next = [
                  first,
                  {
                    ...second,
                    select1: first.select1 === 'buy' ? 'sell' : 'buy',
                    select2: first.select2 === 'buy' ? 'sell' : 'buy',
                  },
                ];

                return {
                  d: next,
                };
              }
              return {};
            },
          ],
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
            {
              type: 'editable-table',
              settings: {
                title: 'd',
                dataIndex: 'd',
                initialValue: [
                  {
                    id: '1',
                    select1: 'buy',
                    select2: 'sell',
                  },
                  {
                    id: '2',
                    select2: 'buy',
                    select1: 'sell',
                  },
                ],
                fieldItems: [
                  {
                    type: 'select',
                    settings: {
                      title: 'select1',
                      dataIndex: 'select1',
                      valueEnums: {
                        buy: '买',
                        sell: '卖',
                      },
                    },
                  },
                  {
                    type: 'select',
                    settings: {
                      title: 'select2',
                      dataIndex: 'select2',
                      valueEnums: {
                        buy: '买',
                        sell: '卖',
                      },
                    },
                  },
                ],
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

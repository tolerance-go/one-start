/**
 * desc: 修改 b 后，a 的值放大 100 倍；修改 c 后，b 的值放大 100 倍；修改表格 a 或者 b 列，将加总得出 c，所有 c 列将加总得出 total-col-c
 */
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';
import type { OSTableChangedValueType } from '@ty-one-start/typings';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          fieldItems: [
            {
              type: 'digit',
              settings: {
                title: 'a',
                dataIndex: 'a',
                valueLinkage: {
                  afterIndexIdRegisted: ['b'],
                  linkage: (changed) => {
                    if ('b' in changed) {
                      return {
                        a: changed.b * 100,
                      };
                    }
                    return {};
                  },
                },
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'b',
                dataIndex: 'b',
                valueLinkage: {
                  afterIndexIdRegisted: ['c'],
                  linkage: (changed) => {
                    if ('c' in changed) {
                      return {
                        b: changed.c * 100,
                      };
                    }
                    return {};
                  },
                },
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
              type: 'digit',
              settings: {
                title: 'total-col-c',
                dataIndex: 'total-col-c',
                valueLinkage: {
                  afterIndexIdRegisted: ['editable-table'],
                  linkage: (changed) => {
                    if ('editable-table' in changed) {
                      const data = changed['editable-table'] as OSTableChangedValueType;

                      return {
                        'total-col-c': data.target
                          ?.map((item) => item.c)
                          .filter(Boolean)
                          .reduce((acc, next) => acc + next, 0),
                      };
                    }
                    return {};
                  },
                },
              },
            },
            {
              type: 'editable-table',
              settings: {
                title: 'd',
                dataIndex: 'editable-table',
                changedValueHasMeta: true,
                initialValue: [
                  {
                    id: '1',
                  },
                  {
                    id: '2',
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
                ],
                valueLinkage: {
                  linkage: (changed) => {
                    if ('editable-table' in changed) {
                      const data = changed['editable-table'] as OSTableChangedValueType;

                      if (data.changedMeta.type === 'modify') {
                        return {
                          'editable-table': {
                            ...data,
                            target: [...data.changedMeta.data].reduce((tableData, changeMeta) => {
                              return tableData?.map((rowData) => {
                                if (rowData.id !== changeMeta.rowId) return rowData;

                                if (changeMeta.dataIndex === 'a') {
                                  const nextA = changeMeta.rowData[changeMeta.dataIndex] ?? 0;
                                  const currentB = rowData.b ?? 0;
                                  return {
                                    ...rowData,
                                    c: nextA + currentB,
                                  };
                                }
                                if (changeMeta.dataIndex === 'b') {
                                  const nextB = changeMeta.rowData[changeMeta.dataIndex] ?? 0;
                                  const currentA = rowData.a ?? 0;
                                  return {
                                    ...rowData,
                                    c: nextB + currentA,
                                  };
                                }

                                return rowData;
                              });
                            }, data.target),
                          },
                        };
                      }
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

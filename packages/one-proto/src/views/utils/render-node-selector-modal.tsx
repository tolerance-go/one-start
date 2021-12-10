import type { OSDialogModalAPI } from '@ty-one-start/one-start';
import { findTreeNodeMeta, OSDialog, OSTable, OSTrigger } from '@ty-one-start/one-start';
import produce from 'immer';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { defaultElementTypeData } from '../constants/default-element-type-data';
import { defaultNodeTypeData } from '../constants/default-node-type-data';
import { osElementSelectorData } from '../constants/os-element-selector-data';
import type { LayoutNodeChildren, LayoutNodeData, NodeDataType } from '../typings';

/** 找到就更新，没找到节点就新增 */
export const renderNodeSelectorModal = (
  trigger: React.ReactElement,
  setAppData: React.Dispatch<React.SetStateAction<NodeDataType[]>>,
  options?: {
    /** 指定表示替换 */
    nodeData?: NodeDataType;
    /** 指定新增的父级组件 */
    parentData?: NodeDataType;
    data?: LayoutNodeData;
  },
) => {
  const { nodeData, parentData } = options ?? {};
  const settingsModalRef = React.createRef<OSDialogModalAPI>();

  return (
    <OSDialog
      type="modal"
      ref={settingsModalRef}
      settings={{
        title: '选择组件',
        body: (
          <OSTable
            settings={{
              rowActions: {
                render: ({ rowData }) => [
                  <OSTrigger
                    type="button"
                    settings={{
                      type: 'primary',
                      text: '应用',
                    }}
                    onClick={() => {
                      setAppData(
                        produce((draft) => {
                          if (nodeData) {
                            const result = findTreeNodeMeta(
                              draft,
                              (item) => item.id === nodeData?.id,
                            );
                            if (result) {
                              if (rowData?.type !== result.item.elementType) {
                                const next = {
                                  id: result.item.id,
                                  configs: defaultElementTypeData[rowData?.type ?? ''],
                                  elementType: rowData?.type,
                                  ...defaultNodeTypeData[rowData?.type ?? ''],
                                };
                                if (result.parent) {
                                  result.parent.children?.splice(result.itemIndex!, 1, {
                                    ...next,
                                    /** layout 下子组件替换需要携带 payload */
                                    data:
                                      result.parent.elementType === 'layout'
                                        ? (result.item as LayoutNodeChildren[number]).data
                                        : undefined,
                                  });
                                } else {
                                  draft.splice(result.itemIndex!, 1, next);
                                }
                              }
                            }
                          } else {
                            let target = draft;
                            if (parentData) {
                              const result = findTreeNodeMeta(
                                draft,
                                (item) => item.id === parentData?.id,
                              );

                              if (result) {
                                result.item.children = result.item.children ?? [];
                                target = result.item.children;
                              }
                            }

                            target.push({
                              id: uuid(),
                              elementType: rowData?.type,
                              configs: defaultElementTypeData[rowData?.type ?? ''],
                              data: options?.data,
                              ...defaultNodeTypeData[rowData?.type ?? ''],
                            });
                          }

                          settingsModalRef.current?.pop();
                        }),
                      );
                    }}
                  ></OSTrigger>,
                ],
              },
              searchFormSettings: {
                labelCol: {
                  span: 6,
                },
                wrapperCol: {
                  span: 18,
                },
              },
              searchFormItemChunkSize: 1,
              fieldItems: [
                {
                  type: 'text',
                  settings: {
                    title: '组件名称',
                    dataIndex: 'name',
                    search: true,
                  },
                },
                {
                  type: 'text',
                  settings: {
                    title: '组件类型',
                    dataIndex: 'type',
                  },
                },
              ],
            }}
            requests={{
              requestDataSource: async () => {
                return {
                  error: false,
                  data: {
                    page: osElementSelectorData,
                    total: osElementSelectorData.length,
                  },
                };
              },
            }}
          ></OSTable>
        ),
      }}
    >
      {trigger}
    </OSDialog>
  );
};

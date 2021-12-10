import {
  findTreeNodeMeta,
  OSActionsField,
  OSDialog,
  OSForm,
  OSTrigger,
} from '@ty-one-start/one-start';
import produce from 'immer';
import React from 'react';
import { osElementTypeFieldItemsMap } from '../constants/os-element-type-field-items-map';
import { renderNodeSelectorModal } from './render-node-selector-modal';
import type { NodeDataType } from '../typings';

export const renderNodeActions = (
  nodeData: NodeDataType,
  setAppData: React.Dispatch<React.SetStateAction<NodeDataType[]>>,
) => {
  return (
    <OSActionsField
      settings={{
        actions: [
          <OSDialog
            type="modal"
            settings={{
              title: '配置',
              body: (
                <OSForm
                  settings={{
                    initialValues: nodeData.configs,
                    fieldItems: osElementTypeFieldItemsMap[nodeData.elementType],
                  }}
                  onValuesChange={(_, values) => {
                    setAppData(
                      produce((draft) => {
                        const result = findTreeNodeMeta(draft, (item) => item.id === nodeData.id);
                        if (result) {
                          result.item.configs = {
                            ...nodeData.configs,
                            settings: values.settings,
                          };
                        }
                      }),
                    );
                  }}
                ></OSForm>
              ),
            }}
          >
            <OSTrigger
              type="button"
              settings={{
                type: 'link',
                text: '配置',
              }}
            ></OSTrigger>
          </OSDialog>,
          renderNodeSelectorModal(
            <OSTrigger
              type="button"
              settings={{
                type: 'link',
                text: '替换',
              }}
            ></OSTrigger>,
            setAppData,
            { nodeData },
          ),
          <OSDialog
            type="popconfirm"
            settings={{
              title: '确认删除吗？',
            }}
            requests={{
              requestAfterConfirm: async () => {
                setAppData(
                  produce((draft) => {
                    const result = findTreeNodeMeta(draft, (item) => item.id === nodeData?.id);
                    if (result) {
                      if (result.parent) {
                        result.parent.children?.splice(result.itemIndex!, 1);
                      } else {
                        draft.splice(result.itemIndex!, 1);
                      }
                    }
                  }),
                );
              },
            }}
          >
            <OSTrigger
              type="button"
              settings={{
                type: 'link',
                danger: true,
                text: '删除',
              }}
            ></OSTrigger>
          </OSDialog>,
        ],
      }}
    ></OSActionsField>
  );
};

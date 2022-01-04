import type {
  OSCore,
  OSFrameType,
  OSTableType,
  OSTextFieldType,
  OSTriggerType,
} from '@ty-one-start/one-start';

type PickPureConfigs<T extends OSCore> = Pick<T, 'type' | 'settings' | 'requests'>;

export type LayoutNodeData = {
  pageId?: string;
};

export type LayoutNodeChildren = (NodeDataType & {
  data?: LayoutNodeData;
})[];

export type CreateNodeData<T> = T & {
  id: string;
  /** 是否在 node 外面包裹一层，通过 hover 方式触发设置弹窗 */
  wrapper?: boolean;
};

export type NodeDataType =
  | CreateNodeData<{
      elementType: 'trigger';
      configs?: PickPureConfigs<OSTriggerType>;
      children?: NodeDataType[];
    }>
  | CreateNodeData<{
      elementType: 'text-field';
      configs?: PickPureConfigs<OSTextFieldType>;
      children?: NodeDataType[];
    }>
  | CreateNodeData<{
      elementType: 'layout';
      configs?: PickPureConfigs<OSFrameType>;
      children?: LayoutNodeChildren;
    }>
  | CreateNodeData<{
      elementType: 'table';
      configs?: PickPureConfigs<OSTableType>;
      children?: NodeDataType[];
    }>;

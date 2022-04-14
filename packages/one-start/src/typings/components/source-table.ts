import type { DataNode, EventDataNode } from '@ty/antd/lib/tree';
import type React from 'react';
import type { Key } from 'react';
import type { RecordType } from '../core';
import type { RequestIO } from './core';
import type {
  CreatePureFormFieldItemConfigsType,
  CreateStaticPureFormFieldItemConfigsType,
  _OSFormType,
} from './form';
import type { _OSLayoutStepsFormType } from './layout-form';
import type { OSTriggerType } from './trigger';
import type {
  CreatePureTableFormFieldItemConfigsType,
  OSTableChangeValueType,
  OSTableValueType,
  RenderActionsType,
  _OSTableAPI,
  _OSTableType,
} from './table';

export type OSSourceTableCategorizableMenuItem = {
  title: string;
  key: string;
  selectable?: boolean;
  icon?: React.ReactNode;
  children?: OSSourceTableCategorizableMenuItem[];
};

export type _OSSourceTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> & {
    /**
     * 在分类树结构中插入节点
     * 在父节点 parentKey 下的 index 后插入
     */
    insertCategorizableTreeChildAfterIndex?: (
      parentKey: Key,
      index: number,
      data: DataNode,
    ) => void;
    insertCategorizableTreeChildLatest?: (parentKey: Key, data: DataNode) => void;
    deleteCategorizableTreeChild?: (parentKey: Key, predicate: (node: DataNode) => boolean) => void;
    /** 刷新左侧菜单 */
    reloadCategorizableList?: () => void;
    /** 获取当前选择的节点信息 */
    getSelectedNode?: <E extends RecordType>() => (E & EventDataNode) | undefined;
  };

export type _OSSourceTableSelfType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomFormValueType,
  StaticCustomFormValueType,
> = {
  settings?: {
    rowTagKey?: string;
    /** 默认激活第一行数据 */
    defaultActiveFirstRow?: {
      type?: 'edit' | 'view';
    };
    /** 操作列宽度 */
    rowActionsColWidth?: number | string;
    /** 支持一级内容分类 */
    categorizable?: {
      /** 标题内容 */
      listTitle?: string;
      /** 表格宽度占比 */
      tableSpan?: number;
      /** 树形操作 */
      actions?: React.ReactNode[];
    };
    /** 表格展示模式，panelable 将展示双栏信息 */
    panelable?: {
      /** 表格宽度占比 */
      tableSpan?: number;
    };
    /** 启动行删除 */
    rowRemoveable?:
      | {
          /** 删除按钮的配置 */
          triggerSettings?: OSTriggerType['settings'];
        }
      | ((options: {
          rowData: RecordType;
          rowIndex: number;
          rowId: string;
          actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
        }) => {
          triggerSettings?: OSTriggerType['settings'];
        });
    /** 启动行查看 */
    rowViewable?:
      | {
          modalTitle?: string;
          modalMask?: boolean | 'transparent';
          modalWidth?: string | number;
          formSettings?: _OSFormType<CustomFormValueType, StaticCustomFormValueType>['settings'];
          triggerSettings?: OSTriggerType['settings'];
        }
      | ((options: {
          rowData: RecordType;
          rowIndex: number;
          rowId: string;
          actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
        }) => {
          modalTitle?: string;
          modalMask?: boolean | 'transparent';
          modalWidth?: string | number;
          formSettings?: _OSFormType<CustomFormValueType, StaticCustomFormValueType>['settings'];
          triggerSettings?: OSTriggerType['settings'];
        });
    /** 启动行编辑 */
    rowEditable?:
      | ({
          modalWidth?: string | number;
        } & (
          | {
              formSettings?: _OSFormType<
                CustomFormValueType,
                StaticCustomFormValueType
              >['settings'];
              formRequests?: _OSFormType<
                CustomFormValueType,
                StaticCustomFormValueType
              >['requests'];
              formType: 'form';
            }
          | {
              formSettings?: _OSLayoutStepsFormType<
                CustomFormValueType,
                StaticCustomFormValueType
              >['settings'];
              formRequests?: Required<
                _OSLayoutStepsFormType<CustomFormValueType, StaticCustomFormValueType>
              >['requests'];
              formType: 'steps-form';
            }
        ))
      | ((options: {
          rowData: RecordType;
          rowIndex: number;
          rowId: string;
          actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
        }) => {
          modalWidth?: string | number;
          triggerSettings?: OSTriggerType['settings'];
        } & (
          | {
              formSettings?: _OSFormType<
                CustomFormValueType,
                StaticCustomFormValueType
              >['settings'];
              formRequests?: _OSFormType<
                CustomFormValueType,
                StaticCustomFormValueType
              >['requests'];
              formType: 'form';
            }
          | {
              formSettings?: _OSLayoutStepsFormType<
                CustomFormValueType,
                StaticCustomFormValueType
              >['settings'];
              formRequests?: Required<
                _OSLayoutStepsFormType<CustomFormValueType, StaticCustomFormValueType>
              >['requests'];
              formType: 'steps-form';
            }
        ));
  };
  requests?: {
    /** 请求分类菜单数据 */
    requestCategorizableData?: RequestIO<
      void,
      {
        data?: OSSourceTableCategorizableMenuItem[];
        /** 删除成功消息提示 */
        message?: string;
      }
    >;
    /** 行删除请求 */
    requestRemoveRow?: RequestIO<
      {
        rowData: RecordType;
        rowIndex: number;
        rowId: string;
        actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
      },
      {
        /** 删除成功消息提示 */
        message?: string;
      }
    >;
    /** 行查看数据请求 */
    requestViewRowData?: RequestIO<
      {
        rowData: RecordType;
        rowIndex: number;
        rowId: string;
        actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
      },
      RecordType
    >;
    /** 获取行编辑数据的初始化数据 */
    requestRowEditData?: RequestIO<
      {
        rowData: RecordType;
        rowIndex: number;
        rowId: string;
        actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
      },
      RecordType
    >;
    /** 请求保存当前编辑后的行数据 */
    requestSaveRowData?: RequestIO<
      {
        rowData: RecordType;
        rowIndex: number;
        rowId: string;
        actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
        values: RecordType;
      },
      {
        /** 保存成功消息提示 */
        message?: string;
      }
    >;
  };
  slots?: {
    /** 自定义分类列表的表格区域渲染 */
    renderCategorizableTable?: (options: {
      node: EventDataNode;
      tableRef: React.RefObject<
        _OSSourceTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>
      >;
      apisRef: React.RefObject<
        Required<
          Pick<
            _OSSourceTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
            | 'deleteCategorizableTreeChild'
            | 'insertCategorizableTreeChildAfterIndex'
            | 'insertCategorizableTreeChildLatest'
            | 'reloadCategorizableList'
          >
        >
      >;
    }) => React.ReactNode;
    renderActions?: RenderActionsType<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      OSSourceTableRenderModelConsumer
    >;
  };
};

export type OSSourceTableRenderModelConsumer = {
  CategorizableRenderModelConsumer: React.Context<{
    activeNode?: EventDataNode | undefined;
  }>['Consumer'];
};

export type _OSSourceTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> = _OSSourceTableSelfType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomFormValueType,
  StaticCustomFormValueType
> &
  Omit<
    _OSTableType<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      CustomTableValueType,
      CustomFormValueType,
      StaticCustomFormValueType,
      Value,
      ChangeValue
    >,
    'slots'
  > & {
    slots?: Omit<
      _OSTableType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType,
        CustomFormValueType,
        StaticCustomFormValueType,
        Value,
        ChangeValue
      >['slots'],
      'renderActions'
    >;
  };

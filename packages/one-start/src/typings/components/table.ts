import type { PaginationProps } from '@ty/antd';
import type { FormInstance } from '@ty/antd/lib/form';
import type { NamePath } from '@ty/antd/lib/form/interface';
import type { ColumnType } from '@ty/antd/lib/table';
import type { SorterResult } from '@ty/antd/lib/table/interface';
import type EventEmitter from 'eventemitter3';
import type { FieldError, ValidateErrorEntity } from 'rc-field-form/lib/interface';
import type { CustomizeComponent, FixedType } from 'rc-table/lib/interface';
import type React from 'react';
import type { RecordType } from '../core';
import type { OSCore, RequestIO, SettingsDataNode } from './core';
import type {
  OSActionsFieldType,
  OSChainSelectFieldType,
  OSCustomFieldType,
  OSDateFieldType,
  OSDateRangeFieldType,
  OSDigitFieldType,
  OSField,
  OSImageFieldType,
  OSMoneyFieldType,
  OSOptionFieldType,
  OSPercentFieldType,
  OSPlaceholderInputFieldType,
  OSRadioFieldType,
  OSRelativeDayFieldType,
  OSSelectFieldType,
  OSSwitchFieldType,
  OSTextareaFieldType,
  OSTextFieldType,
  OSTransferFieldType,
  OSTreeSelectFieldType,
  OSUploadFieldType,
} from './field';
import type {
  CreatePureFormFieldItemConfigs,
  CreatePureFormFieldItemConfigsType,
  CreateStaticPureFormFieldItemConfigs,
  CreateStaticPureFormFieldItemConfigsType,
  OSFormItemDependenciesConfigs,
  _OSFormType,
} from './form';
import type { _OSLayoutStepsFormType } from './layout-form';
import type { OSResMessage } from './message';

export type RequestOptions = {
  current?: number;
  pageSize?: number;
  order?: SorterResult<RecordType>['order'];
  orderBy?: SorterResult<RecordType>['field'];
  manualInitiate?: boolean;
};

export type ColumnOrdersItemMetaType = {
  order: number;
  children?: ColumnOrdersMetaType;
};

export type ColumnOrdersMetaType = Record<
  string,
  | {
      order: number;
      children?: ColumnOrdersMetaType;
    }
  | number
>;

export type TableCoreActions = {
  setTableFormData: (dataSource_?: RecordType[]) => void;
  setVisualDataSource: (dataSource_?: RecordType[]) => void;
  setDataSourceAndFormData: (dataSource_?: OSTableValueType, clearInputCache?: boolean) => void;
  setHeaderFormValues: (values: RecordType) => void;
  setSearchHeadFormOverlayValues: (values: RecordType) => void;
  getHeaderFormValues: () => RecordType;
  switchHeaderFormSwitchMark: (open: boolean) => void;
  once: EventEmitter['once'];
  on: EventEmitter['on'];
  off: EventEmitter['off'];
  emit: EventEmitter['emit'];
  saveLocalColumnWidth: (columnKey: string, width: number) => void;
  getLocalColumnWidth: () => undefined | Record<string, number>;
  removeSelectedRowKeysAndRow?: (
    cb: (prevSelectRowKeys: React.Key[], prevSelectRows: RecordType[]) => React.Key[],
  ) => void;
};

export type _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> = {
  /**
   * 清空上一次单元格用户输入，原作用是避免数值联动冲掉当前输入
   * 但是在手动设置的情况下，需要先清理，避免无效
   */
  clearPrevUserCellInputs: () => void;
  getSearchFormDataSource: () => RecordType | undefined;
  normalizeDataSource: (dataSource_?: RecordType[]) => RecordType[] | undefined;
  getPagination: () => Pick<PaginationProps, 'current' | 'total'> | undefined;
  getDataSource: () => OSTableValueType;
  /** 相较于 getDataSource 会更快，比如如果只是想判断 length 建议用这个  */
  getOriginDataSource: () => OSTableValueType;
  getVisualDataSource: () => OSTableValueType;
  reload: (options?: { current?: number }) => void;
  setDataSource: (dataSource?: RecordType[]) => void;
  getAllColumnsId: () => string[];
  getColumnsStaticPureConfigsIdMaps: () => Record<
    string,
    _OSTableFormFieldItemWithStaticPureConfigs<OSCustomFieldStaticPureTableFormFieldItemConfigsType>
  >;
  getSearchFormCurrentValues: () => RecordType | undefined;
  setSearchFormCurrentValues: (values: RecordType) => void;
  resetSearchFormValues: () => void;
  removeSelection: (rowId: string) => void;
  validate: (nameList?: NamePath[]) => Promise<
    | {
        error: false;
        data: RecordType;
      }
    | {
        error: true;
        data: ValidateErrorEntity;
      }
  >;
  getFieldsError: (nameList?: NamePath[]) => FieldError[];
  getColumnsSettingsTreeData: () => SettingsDataNode[];
  getColumnsSettingsVisibleMap: () => Record<string, boolean> | undefined;
  getColumnsSettingsFixedMap: () => Record<string, FixedType | undefined> | undefined;
  setColumnsSettingsVisibleMap: (visibles?: Record<string, boolean>) => void;
  setColumnsSettingsFixedMap: (fixeds?: Record<string, FixedType | undefined>) => void;
  setColumnsSettingsTreeData: (data?: SettingsDataNode[]) => void;
  getColumnsSettingsOrders: () => ColumnOrdersMetaType | undefined;
  setColumnsSettingsOrders: (orders?: ColumnOrdersMetaType) => void;
  applyColumnSettings: () => void;
  /** TODO: 修改此处类型 */
  getCurrentSearchFormFieldItems: () => Required<_OSFormType<any, any>>['settings']['fieldItems'];
  core: TableCoreActions;
};

export interface OSTableFormGroupFieldType extends OSField {
  type?: 'group';
  settings?: {
    title?: string;
  };
}

export type _OSTableFormFieldItemSettingsFnOption<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
> = {
  form: FormInstance;
  dataSource?: RecordType[];
  rowData?: Record<string, any>;
  rowIndex?: number;
  rowId?: string;
  actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
};

export type OSTableFormFieldItemSearchType = {
  type?: 'only';
  transform?: (input: any) => RecordType;
};

export type OSTableFieldItemConfigable =
  | boolean
  | {
      /** 是否可拖动 */
      draggble?: boolean;
      /** 是否可以切换隐藏 */
      selectable?: boolean;
      /** 是否可以置顶/底 */
      fixable?: boolean;
    };

export interface OSTableFormFieldItemExtra extends OSCore {
  settings?: {
    defaultSortOrder?: ColumnType<RecordType>['defaultSortOrder'];
    sorter?: ColumnType<RecordType>['sorter'];
    editable?: ((rowData: RecordType, rowIndex?: number) => boolean) | boolean;
    search?: boolean | 'only' | OSTableFormFieldItemSearchType;
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    /** 列宽是否可以拖动 */
    resizeable?: boolean;
    fixed?: ColumnType<RecordType>['fixed'];
    align?: ColumnType<RecordType>['align'];
    /** 定义列配置 */
    configable?: OSTableFieldItemConfigable;
    ellipsisTooltip?: boolean;
    /** 单元格高亮 */
    highlight?: (
      rowData: RecordType,
      index?: number,
    ) => {
      type?: highlightTagType;
    };
    cellTooltip?: string | string[];
    shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;

    /** ag-grid 特有的，暂时先存放在这里，后面独立 grid table extra */
    rowGroup?: boolean;
  };
}

export type highlightTagType = 'warning' | 'error' | 'success' | 'default';

export type CreatePureTableFormFieldItemConfigsType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  T extends OSCore = OSCore,
> = CreatePureFormFieldItemConfigs<
  T,
  _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  OSTableFormFieldItemExtra
> &
  OSFormItemDependenciesConfigs;

export type _OSTableFormFieldItem<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
> =
  | CustomValueType
  | (CreatePureFormFieldItemConfigs<
      OSDigitFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTreeSelectFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSImageFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSChainSelectFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSRelativeDayFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSSwitchFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSRadioFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSMoneyFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSPercentFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSOptionFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTextFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSDateFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTextareaFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSDateRangeFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSActionsFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSSelectFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTableFormGroupFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSCustomFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTransferFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSPlaceholderInputFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSUploadFieldType,
      _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs);

export type CreateStaticPureTableFormFieldItemConfigsType<T extends OSCore = OSCore> =
  CreateStaticPureFormFieldItemConfigs<T, OSTableFormFieldItemExtra> &
    OSFormItemDependenciesConfigs;

export type _OSTableFormFieldItemWithStaticPureConfigs<
  CustomValueType extends CreateStaticPureTableFormFieldItemConfigsType,
> =
  | CustomValueType
  | (CreateStaticPureFormFieldItemConfigs<OSDigitFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSChainSelectFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSImageFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSSwitchFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSRadioFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSMoneyFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSPercentFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSOptionFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTextFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSDateFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTextareaFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSDateRangeFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSActionsFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSSelectFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTableFormGroupFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSRelativeDayFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSCustomFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTreeSelectFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTransferFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSPlaceholderInputFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSUploadFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs);

export type _OSTableFormGroupType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  Children = _OSTableFormFieldItems<OSCustomFieldStaticPureTableFormFieldItemConfigsType, OSField>,
> = {
  children?: Children;
  key?: string;
};

export type _OSTableFormFieldItems<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
> = (_OSTableFormFieldItem<OSCustomFieldStaticPureTableFormFieldItemConfigsType, CustomValueType> &
  _OSTableFormGroupType<
    OSCustomFieldStaticPureTableFormFieldItemConfigsType,
    _OSTableFormFieldItems<OSCustomFieldStaticPureTableFormFieldItemConfigsType, CustomValueType>
  >)[];

export type OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType> = {
  current: number;
  pageSize: number;
  order?: SorterResult<RecordType>['order'];
  orderBy?: SorterResult<RecordType>['field'];
  search: RecordType;
  actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
};

export type OSTableRequestDataSourceReturnType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType,
> = {
  fieldItems?: _OSTableFormFieldItems<
    OSCustomFieldStaticPureTableFormFieldItemConfigsType,
    CustomTableValueType
  >;
  page?: OSTableValueType;
  total?: number;
};

export type OSTableChangedValuesMeta = {
  rowId: string;
  rowIndex?: number;
  rowData: RecordType;
  dataIndex: string;
};

export type OSTableChangedValueType = {
  /** 当前的数据源 */
  target: RecordType[] | undefined;
  /**
   * 修改前的数据
   * 联动过程中，不应该修改他
   */
  origin: RecordType[] | undefined;
  changedMeta:
    | {
        type: 'modify';
        data: OSTableChangedValuesMeta[];
      }
    | {
        type: 'insert';
        data: {
          rowId: string;
          rowIndex: number;
          rowData: RecordType;
        }[];
      }
    | {
        type: 'remove';
        data: {
          rowId: string;
          rowIndex: number;
          rowData: RecordType;
        }[];
      };
};

export type OSTableValueType = RecordType[] | undefined;
export type OSTableChangeValueType = RecordType[] | OSTableChangedValueType | undefined;

export type HighlightBadgeItem = {
  color?: string;
  bgColor?: string;
  frontColor?: string;
  label?: string;
  tooltipTitle?: string;
};

export interface _OSTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> extends OSCore {
  settings?: {
    /** 启用列设置 */
    enableColumnsSettings?: boolean;
    autoRequestWhenMounted?: boolean;
    /**
     * 触发 onChange 的 debounce 时间，单位毫秒
     */
    changeDebounceTimestamp?: number;
    /** 高亮徽章配置 */
    highlightBadge?: {
      warning?: HighlightBadgeItem;
      error?: HighlightBadgeItem;
    };
    loopRequest?: number;
    /**
     * 定义 table 唯一 key
     * 当 query 存在 tableKey 会进一步检查 searchValues 初始化搜索表单
     */
    tableKey?: string;
    /** 设置公共字段配置 */
    fieldItemSettings?: _OSTableFormFieldItemWithStaticPureConfigs<StaticCustomFormValueType>['settings'];
    /** 行操作 */
    rowActions?:
      | (React.ReactElement | null)[]
      | ((options: {
          rowData: RecordType;
          rowIndex: number;
          rowId: string;
          actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
        }) => (React.ReactElement | null)[])
      | {
          width?: number | string;
          render: (options: {
            rowData: RecordType;
            rowIndex: number;
            rowId: string;
            actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
          }) => (React.ReactElement | null)[];
        };
    fieldItems?: _OSTableFormFieldItems<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      CustomTableValueType
    >;
    editableRowKeys?: string[];
    pagination?:
      | false
      | Pick<
          PaginationProps,
          | 'simple'
          | 'showSizeChanger'
          | 'hideOnSinglePage'
          | 'defaultPageSize'
          | 'defaultCurrent'
          | 'disabled'
        >;
    /** 操作栏 */
    actions?:
      | ((options: {
          actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
        }) =>
          | React.ReactElement[]
          | {
              left?: React.ReactElement[];
              right?: React.ReactElement[];
            })
      | React.ReactElement[]
      | {
          left?: React.ReactElement[];
          right?: React.ReactElement[];
        };
    /**
     * 设置搜索表单一行展示的控件数量
     * @default 4
     */
    searchFormItemChunkSize?: number;
    rowSelection?: {
      checkStrictly?: boolean;
    };
    /** 搜索表单配置 */
    searchFormSettings?: _OSFormType<CustomFormValueType, StaticCustomFormValueType>['settings'];
    batchOperation?: (options: {
      selectedRowKeys: React.Key[];
      selectedRows: RecordType[];
      actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
    }) => React.ReactNode[];
    rowKey?: string;
    /** 启动树形表格 */
    enableGridTree?: boolean;
    tableHeight?: number;
    tableMaxWidth?: number;
    /** 启动带有修改详细信息的数据，onChange 获得的数据为特殊格式 */
    changedValueHasMeta?: boolean;
    /** 启动垂直行高亮功能 */
    highlightVerticalRow?: boolean;
  };
  requests?: {
    requestDataSource?: RequestIO<
      OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableRequestDataSourceReturnType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType
      >
    >;
    /** 前端分页的搜索请求 */
    requestVisualDataSource?: RequestIO<
      {
        search: RecordType;
        dataSource?: OSTableValueType;
        actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
      },
      OSTableValueType
    >;
  };
  extraBatchOperation?: (options: {
    selectedRowKeys: React.Key[];
    selectedRows: RecordType[];
    actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
  }) => React.ReactNode[];
  extraRowActions?: (options: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
  }) => (React.ReactElement | null)[];
  extraActions?: (options: {
    actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
  }) => (React.ReactElement | null)[];
  /** 手动请求数据 */
  autoRequestWhenMounted?: boolean;
  /** 内部属性，本地化的唯一前缀 */
  __localkey?: string;
  className?: string;
  value?: Value;
  onChange?: (value?: ChangeValue) => void;
  headerWrapper?: CustomizeComponent;
  getFieldItems?: (
    fieldItems?: _OSTableFormFieldItems<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      CustomTableValueType
    >,
  ) =>
    | _OSTableFormFieldItems<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType
      >
    | undefined;
}

export type _OSSourceTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

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
    /** 表格展示模式，panelable 将展示双栏信息 */
    panelable?:
      | {
          /** 表格宽度占比 */
          tableSpan?: number;
        }
      | false;
    /** 启动行删除 */
    rowRemoveable?: {} | false;
    /** 启动行查看 */
    rowViewable?:
      | {
          modalTitle?: string;
          modalMask?: boolean | 'transparent';
          modalWidth?: string | number;
          formSettings?: _OSFormType<CustomFormValueType, StaticCustomFormValueType>['settings'];
        }
      | {
          modalTitle?: string;
          modalMask?: boolean | 'transparent';
          modalWidth?: string | number;
          formSettings?: (options: {
            rowData: RecordType;
            rowIndex: number;
            rowId: string;
            actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
          }) => _OSFormType<CustomFormValueType, StaticCustomFormValueType>['settings'];
        }
      | false;
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
              formType?: 'form';
            }
          | {
              formSettings?: _OSLayoutStepsFormType<
                CustomFormValueType,
                StaticCustomFormValueType
              >['settings'];
              formType?: 'steps-form';
            }
        ))
      | false;
  };
  requests?: {
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
};

export type _OSSourceTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> = {
  settings?: _OSSourceTableSelfType<
    OSCustomFieldStaticPureTableFormFieldItemConfigsType,
    CustomFormValueType,
    StaticCustomFormValueType
  >['settings'];
  requests?: _OSSourceTableSelfType<
    OSCustomFieldStaticPureTableFormFieldItemConfigsType,
    CustomFormValueType,
    StaticCustomFormValueType
  >['requests'];
} & _OSTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType,
  CustomFormValueType,
  StaticCustomFormValueType,
  Value,
  ChangeValue
>;

export type _OSSearchTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type _OSSearchTableSelfType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> = {
  settings?: {
    /** 设置搜索模板 */
    searchTempldateable?: {
      /** 模板名称 key */
      templateNameKey?: string;
      /** 模板管理字段 */
      templateManagementTableFieldItems?: Required<
        _OSSourceTableType<
          OSCustomFieldStaticPureTableFormFieldItemConfigsType,
          CustomTableValueType,
          CustomFormValueType,
          StaticCustomFormValueType,
          Value,
          ChangeValue
        >
      >['settings']['fieldItems'];
      /** 创建模板字段 */
      createFormFieldItems?: Required<
        _OSFormType<CustomFormValueType, StaticCustomFormValueType>
      >['settings']['fieldItems'];
      /** 编辑模板字段 */
      editFormFieldItems?: Required<
        _OSFormType<CustomFormValueType, StaticCustomFormValueType>
      >['settings']['fieldItems'];
    };
  };
  requests?: {
    /** 请求更新当前搜索模板 */
    requestUpdateSearchTempldate?: RequestIO<
      {
        id: string;
        searchValues?: RecordType;
        columnsVisibleMap?: Record<string, boolean>;
        columnsFixedsMap?: Record<string, FixedType | undefined>;
        columnsOrders?: ColumnOrdersMetaType;
      },
      {
        message?: OSResMessage;
      }
    >;
    /** 请求当前应用的模板数据 */
    requestApplayTemplateSearchValues?: RequestIO<
      {
        id: string;
      },
      {
        searchDataSource?: RecordType;
        message?: OSResMessage;
        columnsVisibleMap?: Record<string, boolean>;
        columnsFixedsMap?: Record<string, FixedType | undefined>;
        columnsOrders?: ColumnOrdersMetaType;
      }
    >;
    /** 请求创建搜索模板 */
    requestCreateTemplate?: RequestIO<
      {
        values?: RecordType;
        searchDataSource?: RecordType;
        columnsVisibleMap?: Record<string, boolean>;
        columnsFixedsMap?: Record<string, FixedType | undefined>;
        columnsOrders?: ColumnOrdersMetaType;
      },
      {
        message?: OSResMessage;
      }
    >;
    /** 请求模板列表 */
    requestTemplateDataSource?: Required<
      _OSSourceTableType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType,
        CustomFormValueType,
        StaticCustomFormValueType,
        Value,
        ChangeValue
      >
    >['requests']['requestDataSource'];
    /** 请求删除模版 */
    requestRemoveTemplate?: Required<
      _OSSourceTableType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType,
        CustomFormValueType,
        StaticCustomFormValueType,
        Value,
        ChangeValue
      >
    >['requests']['requestRemoveRow'];
    /** 请求编辑模版初始化数据 */
    requestRowEditTemplate?: Required<
      _OSSourceTableType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType,
        CustomFormValueType,
        StaticCustomFormValueType,
        Value,
        ChangeValue
      >
    >['requests']['requestRowEditData'];
    /** 请求保存模板基本信息 */
    requestSaveRowTemplate?: Required<
      _OSSourceTableType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType,
        CustomFormValueType,
        StaticCustomFormValueType,
        Value,
        ChangeValue
      >
    >['requests']['requestSaveRowData'];
  };
};

export type _OSSearchTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> = {
  settings?: _OSSearchTableSelfType<
    OSCustomFieldStaticPureTableFormFieldItemConfigsType,
    CustomTableValueType,
    CustomFormValueType,
    StaticCustomFormValueType,
    Value,
    ChangeValue
  >['settings'];
  requests?: _OSSearchTableSelfType<
    OSCustomFieldStaticPureTableFormFieldItemConfigsType,
    CustomTableValueType,
    CustomFormValueType,
    StaticCustomFormValueType,
    Value,
    ChangeValue
  >['requests'];
} & _OSSourceTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType,
  CustomFormValueType,
  StaticCustomFormValueType,
  Value,
  ChangeValue
>;

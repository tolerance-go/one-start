import type { PaginationProps } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import type { NamePath } from 'antd/lib/form/interface';
import type { ColumnType } from 'antd/lib/table';
import type { SorterResult } from 'antd/lib/table/interface';
import type EventEmitter from 'eventemitter3';
import type { FieldError, ValidateErrorEntity } from 'rc-field-form/es/interface';
import type { CustomizeComponent, FixedType } from 'rc-table/lib/interface';
import type React from 'react';
import type { RecordType } from '../core';
import type { OSCore, RequestIO, SettingsDataNode } from './core';
import type {
  OSActionsFieldType,
  OSAtomFieldType,
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
  OSSelectFieldValueType,
  OSSwitchFieldType,
  OSTextareaFieldType,
  OSTextFieldType,
  OSTransferFieldType,
  OSTreeSelectFieldType,
  OSTreeSelectFieldValueType,
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

export type RequestOptions = {
  params?: RecordType;
  current?: number;
  pageSize?: number;
  order?: SorterResult<RecordType>['order'];
  orderBy?: SorterResult<RecordType>['field'];
  manualInitiate?: boolean;
  mode?: 'reset' | 'search' | 'unkown';
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

export type TableInlineAPI = {
  getDataSource: () => OSTableValueType;
  getOriginDataSource: () => OSTableValueType;
  getRowKey: () => string;
  isFEPagination: () => boolean;
  getRowSelection: () => RowSelection | undefined;
  setSelectedRowsAndKeys: (rows: RecordType[]) => void;
};

export type TableCoreAPI = {
  setTableFormData: (dataSource_?: RecordType[]) => void;
  setVisualDataSource: (dataSource_?: RecordType[]) => void;
  setDataSourceAndFormData: (dataSource_?: OSTableValueType, clearInputCache?: boolean) => void;
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

export type OSTableChangedCellMeta = {
  rowId: string;
  colId: string;
  prevValue: any;
  nextValue: any;
  prevRowData: RecordType;
  nextRowData: RecordType;
};

export type _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> = {
  /** ????????????????????????????????? */
  getTableFormEditedData?: () => {
    initialTableFormData: Record<string, any>;
    currentTableFormData: Record<string, any>;
    changedCells: OSTableChangedCellMeta[];
    addRowIds: string[];
    removeRowIds: string[];
    updateRowIds: string[];
  };
  /**
   * ????????????????????????
   * ???????????????????????????????????????????????????????????????????????????
   * ?????????????????????debounce change ????????????
   */
  getIntervalLatestUserInputValue: () => Record<string, any> | undefined;
  /**
   * ????????????????????????
   */
  isChangeDebounce: () => boolean;
  /**
   * ???????????????????????????????????????????????????????????????????????????????????????
   * ??????????????????????????????????????????????????????????????????
   */
  clearPrevUserCellInputs: () => void;
  getSearchFormDataSource: () => RecordType | undefined;
  normalizeDataSource: (dataSource_?: RecordType[]) => RecordType[] | undefined;
  getPagination: () => Pick<PaginationProps, 'current' | 'total'> | undefined;
  /** ?????? normalized ???????????? */
  getDataSource: () => OSTableValueType;
  /**
   * ???????????? dataSource ????????? form ??? values
   * ????????? getDataSource ??????????????????????????????????????? length ???????????????
   */
  getOriginDataSource: () => OSTableValueType;
  /**
   * ??????????????????????????????????????????????????????
   */
  getVisualDataSource: () => OSTableValueType;
  reload: (options?: { current?: number; params?: RecordType }) => void;
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
  /** TODO: ?????????????????? */
  getCurrentSearchFormFieldItems: () => Required<_OSFormType<any, any>>['settings']['fieldItems'];
  core: TableCoreAPI;
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
      /** ??????????????? */
      draggble?: boolean;
      /** ???????????????????????? */
      selectable?: boolean;
      /** ??????????????????/??? */
      fixable?: boolean;
    };

export interface OSTableFormFieldItemExtra extends OSCore {
  settings?: {
    defaultSortOrder?: ColumnType<RecordType>['defaultSortOrder'];
    sorter?: ColumnType<RecordType>['sorter'];
    /** align ???????????????????????? rowData */
    editable?: ((rowData?: RecordType, rowIndex?: number) => boolean) | boolean;
    search?: boolean | 'only' | OSTableFormFieldItemSearchType;
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    /** ???????????????????????? */
    resizeable?: boolean;
    fixed?: ColumnType<RecordType>['fixed'];
    align?: ColumnType<RecordType>['align'];
    /** ??????????????? */
    configable?: OSTableFieldItemConfigable;
    ellipsisTooltip?: boolean;
    /** ??????????????? */
    highlight?: (
      rowData: RecordType,
      index?: number,
    ) => {
      type?: highlightTagType;
    };
    cellTooltip?: string | string[];
    shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;

    /** ag-grid ??????????????????????????????????????????????????? grid table extra */
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
      OSSelectFieldType<
        OSSelectFieldValueType,
        {
          form?: FormInstance;
        } & OSTableCellMeta
      >,
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
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSAtomFieldType<
        {
          form?: FormInstance;
        } & OSTableCellMeta
      >,
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
  | (CreateStaticPureFormFieldItemConfigs<
      OSSelectFieldType<
        OSSelectFieldValueType,
        {
          form?: FormInstance;
        } & OSTableCellMeta
      >,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTableFormGroupFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSRelativeDayFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSCustomFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<
      OSTreeSelectFieldType<
        OSTreeSelectFieldValueType,
        {
          form?: FormInstance;
        }
      >,
      OSTableFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTransferFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSPlaceholderInputFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSUploadFieldType, OSTableFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<
      OSAtomFieldType<
        {
          form?: FormInstance;
        } & OSTableCellMeta,
        {
          form?: FormInstance;
        }
      >,
      OSTableFormFieldItemExtra
    > &
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
  params: RecordType;
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

export type OSTableCellMeta = {
  rowId: string;
  rowIndex?: number;
  dataIndex?: NamePath;
  rowData: RecordType;
};

/** ??????????????? dataIndex ????????? string????????????????????? */
export type OSTableChangedValuesMeta = {
  rowId: string;
  rowIndex?: number;
  dataIndex: string;
  rowData: RecordType;
};

export type OSTableChangedValueType = {
  /** ?????????????????? */
  target: RecordType[] | undefined;
  /**
   * ??????????????????
   * ????????????????????????????????????
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
  label?: string;
  tooltipTitle?: string;
};

export type RowSelection = {
  /** ??????????????? */
  type?: 'click-hightlight';
  checkStrictly?: boolean;
  /** ??????????????????????????? */
  defaultSelectAllAfterSearch?: boolean;
  /**
   * ??????????????????????????????
   */
  quicklyBulkSelection?:
    | {
        /* ???????????? */
        all?: {};
        /* ??????????????? */
        // allPage?: {};
        /* ???????????? */
        clearAll?: {};
        /* ??????????????? */
        // clearPage?: {};
        /* ??????????????? */
        invertPage?: {};
      }
    | true;
};

export type RenderActionsType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  P extends Record<string, React.Context<any>['Consumer']> = Record<
    string,
    React.Context<any>['Consumer']
  >,
> = (options: {
  renderConsumers?: P;
  apisRef: React.MutableRefObject<
    _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>
  >;
}) => React.ReactNode | React.ReactNode[];

export interface _OSTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> extends OSCore {
  settings?: {
    /** ???????????????????????????????????????????????? */
    enableEditedCellDiffValueState?: {};
    /** ?????? URL ???????????????????????? */
    syncURLParams?: boolean;
    /** ??????????????? */
    enableColumnsSettings?: boolean;
    autoRequestWhenMounted?: boolean;
    /**
     * ?????? onChange ??? debounce ?????????????????????
     */
    changeDebounceTimestamp?: number;
    /** ?????????????????? */
    highlightBadge?: {
      warning?: HighlightBadgeItem;
      error?: HighlightBadgeItem;
      success?: HighlightBadgeItem;
    };
    loopRequest?: number;
    /**
     * ?????? table ?????? key
     * ??? query ?????? tableKey ?????????????????? searchValues ?????????????????????
     */
    tableKey?: string;
    /** ???????????????????????? */
    fieldItemSettings?: _OSTableFormFieldItemWithStaticPureConfigs<StaticCustomFormValueType>['settings'];
    /** ????????? */
    rowActions?:
      | (React.ReactElement | null)[]
      | ((options: {
          rowData: RecordType;
          rowIndex: number;
          rowId: string;
          actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
        }) => (React.ReactElement | null)[])
      | {
          /** ????????? */
          columnTitle?: string;
          width?: number | string;
          render?: (options: {
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
    /** ????????? */
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
     * ?????????????????????????????????????????????
     * @default 4
     */
    searchFormItemChunkSize?: number;
    /** ???????????????????????? */
    rowSelection?: RowSelection;
    /** ?????????????????? */
    searchFormSettings?: _OSFormType<CustomFormValueType, StaticCustomFormValueType>['settings'];
    batchOperation?: (options: {
      selectedRowKeys: React.Key[];
      selectedRows: RecordType[];
      actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
    }) => React.ReactNode[];
    rowKey?: string;
    /** ?????????????????? */
    enableGridTree?: boolean;
    tableHeight?: number;
    tableMaxWidth?: number;
    /** ??????????????????????????????????????????onChange ?????????????????????????????? */
    changedValueHasMeta?: boolean;
    /** ??????????????????????????? */
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
    /** ??????????????????????????? */
    requestVisualDataSource?: RequestIO<
      {
        search: RecordType;
        dataSource?: OSTableValueType;
        actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
      },
      OSTableValueType
    >;
  };
  hooks?: {
    /** ???????????????????????? */
    afterSearch?: (options: Pick<RequestOptions, 'mode' | 'manualInitiate'>) => void;
  };
  slots?: {
    renderActions?: RenderActionsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
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
  /** ?????????????????? */
  autoRequestWhenMounted?: boolean;
  /** ??????????????????????????????????????? */
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
  requestParams?: {
    requestDataSource?: RecordType;
  };
  /** slots ????????????????????? */
  renderConsumers?: Record<string, React.Context<any>['Consumer']>;
  isEditableTable?: boolean;
}

import type { ColumnState } from '@ag-grid-enterprise/all-modules';
import type { PaginationProps } from '@ty/antd';
import type { ColumnApi, GridApi, GridOptions } from '@ag-grid-enterprise/all-modules';
import type React from 'react';
import type { RecordType, RequestIO } from './core';
import type {
  CreatePureFormFieldItemConfigsType,
  CreateStaticPureFormFieldItemConfigsType,
  _OSFormType,
} from './form';
import type { OSResMessage } from './message';
import type {
  CreatePureTableFormFieldItemConfigsType,
  OSTableChangeValueType,
  OSTableRequestDataSourceParams,
  OSTableRequestDataSourceReturnType,
  OSTableValueType,
  _OSTableAPI,
  _OSTableFormFieldItems,
  _OSTableFormFieldItemWithStaticPureConfigs,
} from './table';

export type AgGridTableAPI = {
  api: GridApi;
  columnApi: ColumnApi;
  gridOptions: GridOptions;
};

export type _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> & {
    gridRef: React.RefObject<AgGridTableAPI>;
  };

export type _OSGridType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> = {
  settings?: {
    width?: number;
    height?: number;
    theme?: string;
    treeDatable?: {
      typeKey?: string;
      valueKey?: string;
    };
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
          actions: _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
        }) => (React.ReactElement | null)[])
      | {
          width?: number | string;
          render: (options: {
            rowData: RecordType;
            rowIndex: number;
            rowId: string;
            actions: _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
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
          'defaultPageSize' | 'simple' | 'showSizeChanger' | 'hideOnSinglePage'
        >;
    /** 操作栏 */
    actions?:
      | ((options: {
          actions: _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
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
    /**
     * 当搜索控件数量小于 searchFormItemChunkSize 时候是否在工具栏同一行显示
     * @default true
     */
    singleSearchForm?: boolean;
    rowSelection?: {
      checkStrictly?: boolean;
    };
    /** 搜索表单配置 */
    searchFormSettings?: _OSFormType<CustomFormValueType, StaticCustomFormValueType>['settings'];
    batchOperation?: (options: {
      selectedRowKeys: React.Key[];
      selectedRows: RecordType[];
      actions: _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
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
        actions: _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
      },
      OSTableValueType
    >;
  };
  extraBatchOperation?: (options: {
    selectedRowKeys: React.Key[];
    selectedRows: RecordType[];
    actions: _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
  }) => React.ReactNode[];
  extraRowActions?: (options: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
  }) => (React.ReactElement | null)[];
  extraActions?: (options: {
    actions: _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
  }) => (React.ReactElement | null)[];
  /** 手动请求数据 */
  autoRequestWhenMounted?: boolean;
  /** 内部属性，本地化的唯一前缀 */
  __localkey?: string;
  className?: string;
  value?: Value;
  onChange?: (value?: ChangeValue) => void;
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
};

export type _OSSourceGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type _OSSourceGridType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> = _OSGridType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType,
  CustomFormValueType,
  StaticCustomFormValueType,
  Value,
  ChangeValue
> & {
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
          formSettings?: _OSFormType<CustomFormValueType, StaticCustomFormValueType>['settings'];
        }
      | false;
    /** 启动行编辑 */
    rowEditable?:
      | {
          modalWidth?: string | number;
          formSettings?: _OSFormType<CustomFormValueType, StaticCustomFormValueType>['settings'];
        }
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

export type _OSSearchGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type _OSSearchGridType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> = _OSSourceGridType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType,
  CustomFormValueType,
  StaticCustomFormValueType,
  Value,
  ChangeValue
> & {
  settings?: {
    /** 设置搜索模板 */
    searchTempldateable?: {
      /** 模板名称 key */
      templateNameKey?: string;
      /** 模板管理字段 */
      templateManagementTableFieldItems?: Required<
        _OSSourceGridType<
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
        columnsState?: Omit<ColumnState, 'aggFunc'>[];
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
        columnsState?: Omit<ColumnState, 'aggFunc'>[];
      }
    >;
    /** 请求创建搜索模板 */
    requestCreateTemplate?: RequestIO<
      {
        values?: RecordType;
        searchDataSource?: RecordType;
        columnsState?: Omit<ColumnState, 'aggFunc'>[];
      },
      {
        message?: OSResMessage;
      }
    >;
    /** 请求模板列表 */
    requestTemplateDataSource?: Required<
      _OSSourceGridType<
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
      _OSSourceGridType<
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
      _OSSourceGridType<
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
      _OSSourceGridType<
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

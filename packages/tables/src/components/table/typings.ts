import type { PaginationProps } from '@ty/antd';
import type { ColumnGroupType, ColumnType } from '@ty/antd/es/table';
import type { FixedType } from 'rc-table/lib/interface';
import type {
  ColumnOrdersMetaType,
  OSFormAPI,
  OSTableFormFieldItemWithStaticPureConfigs,
  RecordType,
  RequestOptions,
  SettingsDataNode,
} from '@ty-one-start/typings';

export type OSAntdColumnExtra = {};

/** TODO: 临时的 children 递归类型 */
export type OSTableFormFieldItemWithStaticPureConfigsWithChildren =
  (OSTableFormFieldItemWithStaticPureConfigs & {
    children: OSTableFormFieldItemWithStaticPureConfigsWithChildren;
  })[];

export type OSAntdColumnsType<RecordType = unknown> = (
  | (ColumnGroupType<RecordType> & OSAntdColumnExtra)
  | (ColumnType<RecordType> & OSAntdColumnExtra)
)[];

export type TreeSpreadActions = {
  clearExpandedRowKeys: () => void;
};

export type SearchFormAPI = {
  formRef: React.MutableRefObject<OSFormAPI | null>;
  isValidate: () => Promise<boolean>;
  isExist: () => boolean;
  resetSearchForm: () => void;
  getSearchFormValues: () => RecordType | undefined;
  getSearchFormDataSource: () => RecordType | undefined;
  setSearchFormValues: (values?: RecordType) => void;
};

export type SelectionsActions = {
  getSelectedRows: () => RecordType[];
  getSelectedRowKeys: () => React.Key[];
  setSelectedRows: React.Dispatch<React.SetStateAction<RecordType[]>>;
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
};

export type ColumnsSettingsActions = {
  getColumnsSettingsTreeData: () => SettingsDataNode[];
  getColumnsSettingsVisibleMap: () => Record<string, boolean> | undefined;
  getColumnsSettingsFixedMap: () => Record<string, FixedType | undefined> | undefined;
  setColumnsSettingsVisibleMap: (visibles?: Record<string, boolean>) => void;
  setColumnsSettingsFixedMap: (fixeds?: Record<string, FixedType | undefined>) => void;
  setColumnsSettingsTreeData: (data?: SettingsDataNode[]) => void;
  getColumnsSettingsOrders: () => ColumnOrdersMetaType;
  setColumnsSettingsOrders: (orders?: ColumnOrdersMetaType) => void;
  applyColumnSettings: () => void;
};

export type EventPayloads = {
  SwitchedSearchForm: {
    open: boolean;
  };
};
export type RequestDataSourceActions = {
  setCurrent: React.Dispatch<React.SetStateAction<number | undefined>>;
  requestDataSource: (options: RequestOptions) => Promise<void>;
  requestVisualDataSource: () => Promise<void>;
  getFieldOptionsMapColId: () => Record<string, Record<string, string>> | undefined;
  getPagination: () => Pick<PaginationProps, 'current' | 'total'>;
} | null;

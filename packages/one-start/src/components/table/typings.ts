import type { ColumnGroupType, ColumnType } from '@ty/antd/es/table';
import type { SorterResult } from '@ty/antd/lib/table/interface';
import type { FixedType } from 'rc-table/lib/interface';
import type {
  ColumnOrdersMetaType,
  OSFormType,
  OSTableFormFieldItemWithStaticPureConfigs,
  RecordType,
  SettingsDataNode,
} from '../../typings';

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

export type SearchFormActions = {
  setSearchFormValues: (
    values: RecordType,
    options?:
      | {
          update?: boolean | undefined;
          updateOverlay?: boolean;
        }
      | undefined,
  ) => void;
  resetSerachFormValues: () => void;
  getSearchFormDataSource: () => RecordType | undefined;
  getCurrentSearchFormFieldItems: () => Required<OSFormType>['settings']['fieldItems'];
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
  requestDataSource: (options: {
    current?: number;
    pageSize?: number;
    order?: SorterResult<RecordType>['order'];
    orderBy?: SorterResult<RecordType>['field'];
    manualInitiate?: boolean;
  }) => Promise<void>;
  requestVisualDataSource: () => Promise<void>;
  getFieldOptionsMapDataIndex: () => Record<string, Record<string, string>> | undefined;
} | null;

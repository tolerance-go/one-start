import type { SorterResult } from '@ty/antd/lib/table/interface';
import type { FixedType } from 'rc-table/lib/interface';
import type { OSFormType, RecordType, SettingsDataNode } from '../typings';

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
};

export type EventPayloads = {
  SwitchedSearchForm: {
    open: boolean;
  };
};

export type RequestDataSourceActions = {
  requestDataSource: (options: {
    current?: number;
    pageSize?: number;
    order?: SorterResult<RecordType>['order'];
    orderBy?: SorterResult<RecordType>['field'];
    manualInitiate?: boolean;
  }) => Promise<void>;
  requestVisualDataSource: () => Promise<void>;
} | null;

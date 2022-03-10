/**
 * 快捷批量选择视图状态
 *  - 选择全部
 *  - 全选当前页
 *  - 清空全部
 *  - 清空当前页
 *  - 反选当前页
 */

import type { TableProps } from '@ty/antd';
import { message } from '@ty/antd';
import { Table } from '@ty/antd';
import type { INTERNAL_SELECTION_ITEM } from '@ty/antd/es/table/hooks/useSelection';
import type {
  OSTableType,
  RecordType,
  RequiredRecursion,
  TableInlineAPI,
} from '../../../../typings';

export const useQuicklyBulkSelectViewsState = ({
  rowSelection,
  setSelectedRowKeys,
  setSelectedRows,
  tableInlineAPISRef,
}: {
  rowSelection?: Required<OSTableType>['settings']['rowSelection'];
  setSelectedRows: React.Dispatch<React.SetStateAction<RecordType[]>>;
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  tableInlineAPISRef: React.MutableRefObject<TableInlineAPI>;
}) => {
  if (rowSelection == null) {
    return {
      selections: undefined,
    };
  }

  const { quicklyBulkSelection } = rowSelection;

  if (quicklyBulkSelection == null) {
    return {
      selections: undefined,
    };
  }

  const all: INTERNAL_SELECTION_ITEM = {
    key: 'all',
    text: '选择全部',
    onSelect: () => {
      if (tableInlineAPISRef.current.isFEPagination()) {
        const rowKey = tableInlineAPISRef.current.getRowKey();

        const originData = tableInlineAPISRef.current.getOriginDataSource() ?? [];

        const allRowKeys = originData.map((item) => item[rowKey]);

        setSelectedRows(originData);
        setSelectedRowKeys(allRowKeys);
        return;
      }

      message.info('暂时不支持后端分页下的选择全部操作');
    },
  };
  // const allPage: INTERNAL_SELECTION_ITEM = { key: 'allPage', text: '全选当前页' };
  const clearAll: INTERNAL_SELECTION_ITEM = Table.SELECTION_NONE;
  // { key: 'clearAll', text: '清空全部' };
  // const clearPage: INTERNAL_SELECTION_ITEM = { key: 'clearPage', text: '清空当前页' };
  const invertPage: INTERNAL_SELECTION_ITEM = Table.SELECTION_INVERT;
  // { key: 'invertPage', text: '反选当前页' };

  if (quicklyBulkSelection === true) {
    return {
      selections: [
        all,
        // allPage,
        clearAll,
        // clearPage,
        invertPage,
      ],
    };
  }

  const maps: Record<keyof typeof quicklyBulkSelection, INTERNAL_SELECTION_ITEM> = {
    all,
    // allPage,
    clearAll,
    // clearPage,
    invertPage,
  };

  const selections: RequiredRecursion<TableProps<RecordType>>['rowSelection']['selections'] =
    Object.keys(quicklyBulkSelection).reduce((acc, key) => {
      if (maps[key] == null) {
        return acc;
      }
      return acc.concat(maps[key]);
    }, []);

  return {
    selections,
  };
};

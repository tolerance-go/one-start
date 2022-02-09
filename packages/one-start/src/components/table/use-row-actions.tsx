import type { ColumnsType } from '@ty/antd/lib/table';
import React from 'react';
import OSActionsField from '../fields/actions';
import type { OSTableType, RecordType, OSTableAPI } from '../../typings';
import type { RequiredRecursion } from '../../typings';
import { DEFAULT_ACTION_COLUMN_TITLE, DEFAULT_WIDTH } from './constants';

export const useRowActions = ({
  columns,
  rowActions,
  rowKey,
  clsPrefix,
  extraRowActions,
  tableActionsRef,
}: {
  columns: ColumnsType<RecordType>;
  rowActions?: RequiredRecursion<OSTableType>['settings']['rowActions'];
  extraRowActions?: OSTableType['extraRowActions'];
  rowKey: string;
  clsPrefix: string;
  tableActionsRef: React.MutableRefObject<OSTableAPI>;
}) => {
  if (columns.length && (rowActions || extraRowActions)) {
    const getWidth = () => {
      if (!Array.isArray(rowActions) && typeof rowActions === 'object') {
        return rowActions.width ?? DEFAULT_WIDTH;
      }
      return DEFAULT_WIDTH;
    };

    const getColTitle = () => {
      if (!Array.isArray(rowActions) && typeof rowActions === 'object') {
        return rowActions.columnTitle ?? DEFAULT_ACTION_COLUMN_TITLE;
      }
      return DEFAULT_ACTION_COLUMN_TITLE;
    };

    return {
      columns: columns.concat({
        onHeaderCell: () => {
          return {
            className: `${clsPrefix}-column-header`,
          };
        },
        align: 'center',
        fixed: 'right',
        title: getColTitle(),
        key: 'row-actions',
        width: getWidth(),
        render: (value, record, index) => {
          const getActions = () => {
            if (rowActions == null) return [];

            if (typeof rowActions === 'function') {
              return rowActions({
                rowData: record,
                rowIndex: index,
                rowId: record[rowKey],
                actions: tableActionsRef.current,
              });
            }
            if (Array.isArray(rowActions)) {
              return rowActions;
            }

            if (typeof rowActions === 'object') {
              const { render } = rowActions;
              return render?.({
                rowData: record,
                rowIndex: index,
                rowId: record[rowKey],
                actions: tableActionsRef.current,
              });
            }

            return [];
          };

          const getMergeActions = (actions?: (React.ReactElement | null)[]) => {
            return [
              ...(
                extraRowActions?.({
                  rowIndex: index,
                  rowId: record.id,
                  actions: tableActionsRef.current,
                  rowData: record,
                }) ?? []
              ).filter(Boolean),
              ...(actions ?? []),
            ];
          };

          return (
            <OSActionsField
              settings={{
                actions: getMergeActions(getActions()),
              }}
            ></OSActionsField>
          );
        },
      }),
    };
  }

  return {
    columns,
  };
};

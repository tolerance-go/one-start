import type { ColumnsType } from '@ty/antd/lib/table';
import React from 'react';
import OSActionsField from '../fields/actions';
import type { OSTableType, RecordType, OSTableAPI } from '../typings';
import type { RequiredRecursion } from '../utils/typings';
import { DEFAULT_WIDTH } from './constants';

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
  if (rowActions || extraRowActions) {
    const getWidth = () => {
      if (
        typeof rowActions !== 'function' &&
        !Array.isArray(rowActions) &&
        typeof rowActions === 'object'
      ) {
        return rowActions.width ?? DEFAULT_WIDTH;
      }
      return DEFAULT_WIDTH;
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
        title: '操作',
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
              return render({
                rowData: record,
                rowIndex: index,
                rowId: record[rowKey],
                actions: tableActionsRef.current,
              });
            }

            return [];
          };

          const getMergeActions = (actions: (React.ReactElement | null)[]) => {
            return [
              ...(
                extraRowActions?.({
                  rowIndex: index,
                  rowId: record.id,
                  actions: tableActionsRef.current,
                  rowData: record,
                }) ?? []
              ).filter(Boolean),
              ...actions,
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

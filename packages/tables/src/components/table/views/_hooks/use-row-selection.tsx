import utl from 'lodash';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useActionsRef } from '@ty-one-start/utils';
import type { RecordType, TableCoreAPI } from '@ty-one-start/typings';
import type { SelectionsActions } from '../../typings';

export const useRowSelection = ({
  tableCoreActionsRef,
  rowKey,
  ref,
}: {
  tableCoreActionsRef: React.MutableRefObject<TableCoreAPI>;
  rowKey: string;
  ref: React.MutableRefObject<Partial<SelectionsActions> | null>;
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<RecordType[]>([]);

  const selectedRowsMaps = useMemo(() => {
    return selectedRows.reduce((maps, next) => {
      return {
        ...maps,
        [next[rowKey]]: next,
      };
    }, {});
  }, [rowKey, selectedRows]);

  // eslint-disable-next-line no-param-reassign
  tableCoreActionsRef.current.removeSelectedRowKeysAndRow = (cb) => {
    const removeKeys = cb(selectedRowKeys, selectedRows);
    if (removeKeys.length === 0) return;
    const leftKeys = utl.difference(selectedRowKeys, removeKeys);
    const leftRows = utl.differenceWith(selectedRows, removeKeys, (row, key) => {
      return row[rowKey] === key;
    });
    setSelectedRowKeys(leftKeys);
    setSelectedRows(leftRows);
  };

  useActionsRef(
    {
      getSelectedRowKeys: () => selectedRowKeys,
      getSelectedRows: () => selectedRows,
      setSelectedRows,
      setSelectedRowKeys,
    },
    ref,
  );

  return {
    selectedRowKeys,
    selectedRows,
    selectedRowsMaps,
    setSelectedRowKeys,
    setSelectedRows,
  };
};

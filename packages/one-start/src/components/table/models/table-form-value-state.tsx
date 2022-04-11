/**
 * row 选择信息的外部 model，不放在 table 中是为了避免 table 大范围无效 render，
 * 应该只关联 table 内部的某个组件中，比如 table-header-row
 */
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import type {
  OSTableAPI,
  OSTableChangedCellMeta,
  OSTableValueType,
  RecordType,
  TableCoreAPI,
} from '../../../typings';
import { useActionsRef } from '../../hooks/use-actions-ref';
import { convertTableDataSourceToFormValues } from '../utils/convert-table-data-source-to-form-values';

const useTableFormValueState = (initalState?: {
  enableEditedCellDiffValueState?: {};
  tableActionsRef: React.RefObject<OSTableAPI>;
  tableCoreActionsRef: React.RefObject<TableCoreAPI>;
  /**
   * @TODO
   * 后面重构的时候，将 table value 改为更贴近表单的格式，变为 Record<id, any>
   * 并且 table value 和 change event 完全分割，value 不会有 change event 的可能
   */
  value?: OSTableValueType;
  rowKey: string;
}) => {
  const {
    tableActionsRef,
    tableCoreActionsRef,
    value,
    rowKey = 'id',
    enableEditedCellDiffValueState,
  } = initalState ?? {};
  const [initialTableFormValue, setInitialTableFormValue] = useState<Record<string, any>>(() => {
    return convertTableDataSourceToFormValues(rowKey, value);
  });
  const [currentTableFormValue, setCurrentTableFormValue] = useState<Record<string, any>>({});

  const cellValueIsDiff = (colId: string, rowId: string) => {
    const diffed = currentTableFormValue[rowId]?.[colId] !== initialTableFormValue[rowId]?.[colId];
    return diffed;
  };

  const getTableFormEditedData = (): {
    initialTableFormValue: Record<string, any>;
    currentTableFormValue: Record<string, any>;
    addRowIds: string[];
    removeRowIds: string[];
    updateRowIds: string[];
    changedCells: OSTableChangedCellMeta[];
  } => {
    const changedCells = Object.keys(currentTableFormValue).reduce((acc, rowId_) => {
      return Object.keys(currentTableFormValue[rowId_]).reduce((acc_, colId_) => {
        if (cellValueIsDiff(colId_, rowId_)) {
          return acc_.concat({
            rowId: rowId_,
            colId: colId_,
            /** 如果是新增行，可能出现空数据的问题 */
            prevValue: initialTableFormValue[rowId_]?.[colId_],
            nextValue: currentTableFormValue[rowId_][colId_],
            prevRowData: initialTableFormValue[rowId_],
            nextRowData: currentTableFormValue[rowId_],
          });
        }
        return acc_;
      }, acc);
    }, [] as OSTableChangedCellMeta[]);

    const addRowIds = Object.keys(currentTableFormValue ?? {}).filter(
      (rowId) => rowId in (initialTableFormValue ?? {}) === false,
    );

    const updateRowIds = Object.keys(currentTableFormValue ?? {}).filter(
      (rowId) =>
        rowId in (initialTableFormValue ?? {}) &&
        changedCells.find(({ rowId: cellChangedWithRowId }) => cellChangedWithRowId === rowId),
    );

    const removeRowIds = Object.keys(initialTableFormValue ?? {}).filter(
      (rowId) => rowId in (currentTableFormValue ?? {}) === false,
    );

    return {
      removeRowIds,
      updateRowIds,
      addRowIds,
      initialTableFormValue,
      currentTableFormValue,
      changedCells,
    };
  };

  useActionsRef(
    {
      getTableFormEditedData,
    },
    tableActionsRef,
  );

  useEffect(() => {
    if (enableEditedCellDiffValueState) {
      const apis = tableCoreActionsRef?.current;

      const handleInitedTableDataSource = (data: OSTableValueType) => {
        const next = convertTableDataSourceToFormValues(rowKey, data);
        setInitialTableFormValue(next);
        setCurrentTableFormValue(next);
      };

      const handleTableFormValuesEdited = (data: Record<string, any>) => {
        /** data 可能只是一页的 form item 渲染数据，这里覆盖相同 rowId 即可 */
        setCurrentTableFormValue((prev) => ({ ...prev, ...data }));
      };

      const handleTableFormValuesRemoved = (rowId: string) => {
        /** data 可能只是一页的 form item 渲染数据，这里覆盖相同 rowId 即可 */
        setCurrentTableFormValue((prev) => {
          const next = { ...prev };
          delete next[rowId];
          return next;
        });
      };

      const handleTableFormValuesAdded = (rowDataList: RecordType[]) => {
        /** data 可能只是一页的 form item 渲染数据，这里覆盖相同 rowId 即可 */
        setCurrentTableFormValue((prev) => {
          const next = {
            ...prev,
            ...rowDataList.reduce((acc, rowData) => {
              const rowId = rowData[rowKey];
              return {
                ...acc,
                [rowId]: rowData,
              };
            }, {}),
          };
          return next;
        });
      };

      apis?.on('initedTableDataSource', handleInitedTableDataSource);
      apis?.on('tableFormValuesEdited', handleTableFormValuesEdited);
      apis?.on('tableFormValuesRemoved', handleTableFormValuesRemoved);
      apis?.on('tableFormValuesAdded', handleTableFormValuesAdded);
      return () => {
        apis?.off('initedTableDataSource', handleInitedTableDataSource);
        apis?.off('tableFormValuesEdited', handleTableFormValuesEdited);
        apis?.off('tableFormValuesRemoved', handleTableFormValuesRemoved);
        apis?.off('tableFormValuesAdded', handleTableFormValuesAdded);
      };
    }
    return undefined;
  }, []);

  return { cellValueIsDiff, setInitialTableFormValue, setCurrentTableFormValue };
};

export const TableFormValueStateModel = createContainer(useTableFormValueState);

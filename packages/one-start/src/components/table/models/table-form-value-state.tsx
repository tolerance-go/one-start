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
} from '../@ty-one-start/typings';
import { useActionsRef } from '../../hooks/use-actions-ref';
import { convertTableDataSourceToFormValues } from '../utils/convert-table-data-source-to-form-values';
import ReactDOM from 'react-dom';

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

  /**
   * formData 和 formValue 的区别在于前者的 value 可能包含注册表单字段以外的数据，
   * 而后者只包含注册表单字段的数据，比如 表格 rowData 中包含自定义字段 _id，它不是
   * 注册的 form item 上的 name，所以 formValue 中不包含 _id，而 formData 包含了
   */
  const [initialTableFormData, setInitialTableFormData] = useState<Record<string, any>>(() => {
    return convertTableDataSourceToFormValues(rowKey, value);
  });
  const [currentTableFormData, setCurrentTableFormData] = useState<Record<string, any>>({});
  const [currentTableFormValue, setCurrentTableFormValue] = useState<Record<string, any>>({});

  const cellValueIsDiff = (colId: string, rowId: string) => {
    const diffed = currentTableFormData[rowId]?.[colId] !== initialTableFormData[rowId]?.[colId];
    return diffed;
  };

  const getTableFormEditedData = (): {
    initialTableFormData: Record<string, any>;
    currentTableFormData: Record<string, any>;
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
            prevValue: initialTableFormData[rowId_]?.[colId_],
            nextValue: currentTableFormValue[rowId_][colId_],
            prevRowData: initialTableFormData[rowId_],
            nextRowData: currentTableFormData[rowId_],
          });
        }
        return acc_;
      }, acc);
    }, [] as OSTableChangedCellMeta[]);

    const addRowIds = Object.keys(currentTableFormData ?? {}).filter(
      (rowId) => rowId in (initialTableFormData ?? {}) === false,
    );

    const updateRowIds = Object.keys(currentTableFormData ?? {}).filter(
      (rowId) =>
        rowId in (initialTableFormData ?? {}) &&
        changedCells.find(({ rowId: cellChangedWithRowId }) => cellChangedWithRowId === rowId),
    );

    const removeRowIds = Object.keys(initialTableFormData ?? {}).filter(
      (rowId) => rowId in (currentTableFormData ?? {}) === false,
    );

    return {
      removeRowIds,
      updateRowIds,
      addRowIds,
      initialTableFormData,
      currentTableFormData,
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
        ReactDOM.unstable_batchedUpdates(() => {
          setInitialTableFormData(next);
          setCurrentTableFormData(next);
          /** TODO: 可能存在数据不一致 data -> value */
          setCurrentTableFormValue(next);
        });
      };

      const handleTableFormValuesEdited = (data: Record<string, any>) => {
        ReactDOM.unstable_batchedUpdates(() => {
          /**
           * data 可能只是一页的 form item 渲染数据，这里覆盖相同 rowId 即可
           * rowData 里面可能存在额外的字段（不是 form item），form values change 的时候不要覆盖它
           */
          setCurrentTableFormData((prev) =>
            Object.keys({
              ...prev,
              ...data,
            }).reduce((acc, key) => {
              if (key in data && key in prev) {
                return {
                  ...acc,
                  [key]: {
                    ...prev[key],
                    ...data[key],
                  },
                };
              }
              if (key in data) {
                return {
                  ...acc,
                  [key]: data[key],
                };
              }
              if (key in prev) {
                return {
                  ...acc,
                  [key]: prev[key],
                };
              }
              return acc;
            }, {}),
          );
          setCurrentTableFormValue((prev) => ({ ...prev, ...data }));
        });
      };

      const handleTableFormValuesRemoved = (rowId: string) => {
        /** data 可能只是一页的 form item 渲染数据，这里覆盖相同 rowId 即可 */
        setCurrentTableFormData((prev) => {
          const next = { ...prev };
          delete next[rowId];
          return next;
        });
      };

      const handleTableFormValuesAdded = (rowDataList: RecordType[]) => {
        /** data 可能只是一页的 form item 渲染数据，这里覆盖相同 rowId 即可 */
        setCurrentTableFormData((prev) => {
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

  return { cellValueIsDiff, setInitialTableFormData, setCurrentTableFormData };
};

export const TableFormValueStateModel = createContainer(useTableFormValueState);

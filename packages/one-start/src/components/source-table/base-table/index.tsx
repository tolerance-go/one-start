import React from 'react';
import type {
  OSSourceTableAPI,
  OSSourceTableType,
  OSTableAPI,
  OSTableType,
  RequiredRecursion,
} from '../../../typings';
import OSTable from '../../table/views';
import { normalizeRequestOutputs } from '../../utils/normalize-request-outputs';
import type { RowMeta } from '../typings';
import { renderRowActions } from './row-actions';

const BaseTable: React.ForwardRefRenderFunction<
  OSSourceTableAPI,
  OSSourceTableType & {
    tableRef: React.RefObject<OSTableAPI>;
    setActiveMeta?: React.Dispatch<React.SetStateAction<RowMeta | undefined>>;
    activeMeta?: RowMeta;
  }
> = ({ tableRef, setActiveMeta, activeMeta, ...restProps }) => {
  const { settings, requests } = restProps;
  const {
    rowRemoveable,
    rowViewable,
    rowEditable,
    rowActionsColWidth,
    defaultActiveFirstRow,
    rowTagKey,
    panelable,
    rowActions,
  } = settings ?? {};
  const { requestRemoveRow, requestViewRowData, requestRowEditData, requestSaveRowData } =
    requests ?? {};

  const enableRowActions = rowViewable || rowEditable || rowRemoveable;

  const requestTableDataSource: RequiredRecursion<OSTableType>['requests']['requestDataSource'] =
    async (params) => {
      const result = await restProps.requests
        ?.requestDataSource?.(params)
        .then(normalizeRequestOutputs);
      if (
        defaultActiveFirstRow &&
        !result?.error &&
        (activeMeta == null ||
          (activeMeta != null &&
            result?.data?.page?.map((item) => item.id)?.includes(activeMeta.rowId) === false))
      ) {
        const rowData = result?.data?.page?.[0] ?? {};
        const firstRowMeta = {
          rowData,
          rowIndex: 0,
          rowId: rowData.id,
          actions: tableRef.current!,
          type: defaultActiveFirstRow.type ?? 'edit',
        };
        setActiveMeta?.(firstRowMeta);
      }
      return result;
    };

  const { slots, ...others } = restProps;

  return (
    <OSTable
      {...others}
      /** 因为某些原因不能用泛型 slots.renderActions 是覆盖的，类型更加精确，传给上级组件类型转换需要强制   */
      slots={slots as OSTableType['slots']}
      ref={tableRef}
      settings={{
        rowSelection: {
          type: 'click-hightlight',
          ...restProps.settings?.rowSelection,
        },
        ...restProps.settings,
        rowActions: enableRowActions
          ? {
              width: rowActionsColWidth ?? 150,
              render: renderRowActions({
                panelable,
                rowActions,
                rowViewable,
                rowEditable,
                rowRemoveable,
                rowTagKey,
                requestRemoveRow,
                requestViewRowData,
                requestRowEditData,
                requestSaveRowData,
                setActiveMeta,
              }),
            }
          : restProps.settings?.rowActions,
      }}
      requests={{
        ...restProps.requests,
        requestDataSource: requestTableDataSource,
      }}
    ></OSTable>
  );
};

export default BaseTable;

import React, { useImperativeHandle, useRef, useState } from 'react';
import type { OSSourceTableAPI, OSSourceTableSelfType, OSSourceTableType } from '../../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import BaseTable from './base-table';
import { CategorizableView } from './categorizable-view';
import { PanelView } from './panel-view';
import type { RowMeta } from './typings';

const OSSourceTable: React.ForwardRefRenderFunction<OSSourceTableAPI, OSSourceTableType> = (
  props,
  ref,
) => {
  const { settings, requests, slots } = props;
  const { rowViewable, panelable, rowEditable, categorizable } = settings ?? {};
  const { renderCategorizableTable } = slots ?? {};
  const { requestViewRowData, requestRowEditData, requestSaveRowData, requestCategorizableData } =
    requests ?? {};
  const clsPrefix = useClsPrefix('source-table');
  const [activeMeta, setActiveMeta] = useState<RowMeta>();

  const tableRef = useRef<OSSourceTableAPI>(null);

  useImperativeHandle(ref, () => tableRef.current!);

  if (categorizable) {
    return (
      <CategorizableView
        tableProps={props}
        tableRef={tableRef}
        categorizable={categorizable}
        clsPrefix={clsPrefix}
        requestCategorizableData={requestCategorizableData}
        renderCategorizableTable={renderCategorizableTable}
      />
    );
  }

  const baseTableDom = (
    <BaseTable
      {...props}
      setActiveMeta={setActiveMeta}
      tableRef={tableRef}
      activeMeta={activeMeta}
    />
  );

  if (panelable) {
    return (
      <PanelView
        activeMeta={activeMeta}
        rowViewable={rowViewable}
        panelable={panelable}
        clsPrefix={clsPrefix}
        baseTableDom={baseTableDom}
        rowEditable={rowEditable}
        requestViewRowData={requestViewRowData}
        requestRowEditData={requestRowEditData}
        requestSaveRowData={requestSaveRowData}
      />
    );
  }

  return baseTableDom;
};

export default React.forwardRef(OSSourceTable);
export const Settings: React.FC<OSSourceTableSelfType['settings']> = () => <></>;
export const Requests: React.FC<OSSourceTableSelfType['requests']> = () => <></>;

import cls from 'classnames';
import React from 'react';
import type { OSTableFormFieldItemExtra, OSTableType, RecordType } from '../../../typings';
import { TableFormValueStateModel } from '../models/table-form-value-state';
import './table-body-cell.less';

export type TableBodyCellProps = React.HTMLAttributes<HTMLTableCellElement> & {
  rowId: string;
  colId: string;
  rowData: RecordType;
  rowIndex: number;
  editable?: Required<OSTableFormFieldItemExtra>['settings']['editable'];
  enableEditedCellDiffValueState?: Required<
    Required<OSTableType>['settings']
  >['enableEditedCellDiffValueState'];
};

const TableBodyCell: React.ForwardRefRenderFunction<HTMLTableRowElement, TableBodyCellProps> = (
  props,
) => {
  const { rowId, colId, editable, rowData, rowIndex, enableEditedCellDiffValueState, ...rest } =
    props;

  const { cellValueIsDiff } = TableFormValueStateModel.useContainer();

  return (
    <td
      {...rest}
      className={cls(
        {
          'cell-value-is-diff':
            enableEditedCellDiffValueState &&
            (() => {
              if (typeof editable === 'function') {
                return editable(rowData, rowIndex);
              }
              return editable;
            })()
              ? cellValueIsDiff(colId, rowId)
              : false,
        },
        rest.className,
      )}
    >
      {props.children}
    </td>
  );
};

export default React.forwardRef(TableBodyCell);

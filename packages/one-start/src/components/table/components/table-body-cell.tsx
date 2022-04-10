import cls from 'classnames';
import React from 'react';
import type { OSTableType } from '../../../typings';
import { TableFormValueStateModel } from '../models/table-form-value-state';
import './table-body-cell.less';

export type TableBodyCellProps = React.HTMLAttributes<HTMLTableCellElement> & {
  rowId: string;
  colId: string;
  editable?: boolean;
  enableEditedCellDiffValueState?: Required<
    Required<OSTableType>['settings']
  >['enableEditedCellDiffValueState'];
};

const TableBodyCell: React.ForwardRefRenderFunction<HTMLTableRowElement, TableBodyCellProps> = (
  props,
) => {
  const { rowId, colId, editable, enableEditedCellDiffValueState, ...rest } = props;

  const { cellValueIsDiff } = TableFormValueStateModel.useContainer();

  return (
    <td
      {...rest}
      className={cls(
        {
          'cell-value-is-diff':
            enableEditedCellDiffValueState && editable ? cellValueIsDiff(colId, rowId) : false,
        },
        rest.className,
      )}
    >
      {props.children}
    </td>
  );
};

export default React.forwardRef(TableBodyCell);

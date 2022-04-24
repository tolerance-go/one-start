import type { OSTableType } from '@ty-one-start/typings';
import cls from 'classnames';
import React, { useMemo } from 'react';
import { RowSelectionModel } from '../models/row-selection';

export type TableBodyRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  rowId: string;
  rowSelectionType?: Required<Required<OSTableType>['settings']>['rowSelection']['type'];
};

const TableBodyRow: React.ForwardRefRenderFunction<HTMLTableRowElement, TableBodyRowProps> = (
  props,
) => {
  const { rowId, rowSelectionType, ...rest } = props;

  const { rowSelectedState, selectRows } = RowSelectionModel.useContainer();

  const selected = useMemo(() => {
    return !!rowSelectedState[rowId];
  }, [rowId, rowSelectedState]);

  return (
    <tr
      {...rest}
      onClick={(event) => {
        if (rowSelectionType === 'click-hightlight') {
          selectRows([rowId]);
        }

        rest.onClick?.(event);
      }}
      className={cls(
        {
          selected,
        },
        rest.className,
      )}
    >
      {useMemo(() => {
        return props.children;
      }, [props.children])}
    </tr>
  );
};

export default React.forwardRef(TableBodyRow);

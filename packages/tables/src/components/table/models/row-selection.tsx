/**
 * row 选择信息的外部 model，不放在 table 中是为了避免 table 大范围无效 render，
 * 应该只关联 table 内部的某个组件中，比如 table-header-row
 */

import utl from 'lodash';
import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useRowSelection = () => {
  const [rowSelectedState, setRowSelectedState] = useState<Record<string, boolean>>({});

  const selectRows = (rowIds: string[]) => {
    setRowSelectedState(utl.fromPairs(rowIds.map((rowId) => [rowId, true])));
  };

  return { rowSelectedState, selectRows };
};

export const RowSelectionModel = createContainer(useRowSelection);

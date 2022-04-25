/**
 * row 选择信息的外部 model，不放在 table 中是为了避免 table 大范围无效 render，
 * 应该只关联 table 内部的某个组件中，比如 table-header-row
 */

import type { EventDataNode } from 'antd/lib/tree';
import React from 'react';

export const CategorizableRenderModel = React.createContext<{
  activeNode?: EventDataNode;
}>({
  activeNode: undefined,
});

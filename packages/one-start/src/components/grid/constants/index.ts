export { default as AgGridLocalZhCN } from './local-zhCN';

export const searchHeadFormFieldRowId = '$head';

export const searchHeadFormFieldRowIdOverlay = '$head-overlay';

/** 表单中标记展开的 id */
export const searchHeadFormSwitchIsOpenMarkId = '$head-switch';

export const tdSelfClassTag = 'td-self-class-tag';

/** 竖向行单元格前缀 */
export const verticalRowCellWithKeyClsPrefix = 'vertical-cell-with-key';

export const headerCellWithKeyClsPrefix = 'header-cell-with-key';

export const defaultPageSize = 20;

/** 搜索表单是否展开的本地存储 key */
export const searchFormVisibleLocalField = 'LOCAL_SEARCH_FORM_VISIBLE';

/** 搜索列头的 icon */
export const searchFixedIconCls = 'searchFixedIcon';

export const eventNames = {
  switchedSearchForm: 'switched-search-form',
  /** 列宽正在拖拽中 */
  columnsWidthResizing: 'columnsWidthResizing',
  /** 点击搜索 reset 按钮 */
  onSearchFormReset: 'onSearchFormReset',
};

export const DEFAULT_WIDTH = 160;

/** 默认表格高度 */
export const DEFAULT_TABLE_HEIGHT = 750;

/** 虚拟列表的高度 */
export const DEFAULT_ROW_HEIGHT = 31;

/** 默认的搜索表单一行显示数量 */
export const DEFAULT_SEARCH_FORM_DISPLAYS_QUANTITY_IN_ONE_ROW = 4;

import { formatter, parser } from './format';
import { normalizeArray } from './normalize-array';
import { normalizeRequestOutputs } from './normalize-request-outputs';
import { parseFieldChangeEvent } from './parse-field-change-event';
import { unstateHistory } from './unstate-history';
import { useLoading } from './use-loading';

import CloseIconAction from './components/close-icon-action';

export const eventNames = {
  /** 联动计算结束 */
  linkageFinished: 'linkageFinished',
};

export * from './constants/digit';
export * from './get-id';
export * from './run-settings';

export * from './hooks/use-actions-ref';
export * from './log-request-message';
export * from './normalize-data-index';
export * from './parse-table-value';
export * from './tree-utils';
export * from './use-cls-prefix';
export * from './with-debounce';
export * from './dom-tree';
export * from './use-update-effect';
export * from './momentify';
export * from './use-render-tooltip';
export * from './format';
export * from './table-cell-error-validate';

export {
  parseFieldChangeEvent,
  normalizeArray,
  unstateHistory,
  useLoading,
  normalizeRequestOutputs,
  utils,
  CloseIconAction,
};

const utils = {
  formatter,
  parser,
  normalizeRequestOutputs,
};

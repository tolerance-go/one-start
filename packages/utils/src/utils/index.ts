import { formatter, parser } from './format';
import { normalizeArray } from './normalize-array';
import { normalizeRequestOutputs } from './normalize-request-outputs';
import { parseFieldChangeEvent } from './parse-field-change-event';
import { unstateHistory } from './unstate-history';
import { useLoading } from './use-loading';

import CloseIconAction from './components/close-icon-action';

export * from './constants/digit';

export * from './hooks/use-actions-ref';
export * from './log-request-message';
export * from './normalize-data-index';
export * from './parse-table-value';
export * from './tree-utils';
export * from './use-cls-prefix';
export * from './with-debounce';
export * from './render-field';
export * from './render-table-form-item';
export * from './dom-tree';
export * from './render-field-base';
export * from './render-form-item';
export * from './use-update-effect';
export * from './momentify';
export * from './use-render-tooltip';
export * from './format';

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

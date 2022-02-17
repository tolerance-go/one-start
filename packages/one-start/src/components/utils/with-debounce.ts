import utl from 'lodash';

export const withDebounce =
  (timestamp: number) =>
  <T extends (...args: any[]) => any>(fn: T) =>
    timestamp ? utl.debounce(fn, timestamp) : fn;

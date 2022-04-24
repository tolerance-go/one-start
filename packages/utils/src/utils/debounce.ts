import utl from 'lodash';

export const debounceFn =
  (timestamp: number) =>
  <T extends (...args: any[]) => any>(fn?: T) =>
    fn != null ? utl.debounce(fn, timestamp) : undefined;

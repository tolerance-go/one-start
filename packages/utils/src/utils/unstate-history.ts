import type { RecordType } from '@ty-one-start/typings';
import qs from 'qs';

export const unstateHistory = {
  _base({
    pathname,
    query,
    method,
    merged,
  }: {
    method: 'pushState' | 'replaceState';
    pathname: string;
    query?: RecordType;
    merged?: boolean;
  }) {
    const mergedQuery = {
      ...(merged
        ? qs.parse(window.location.search, {
            ignoreQueryPrefix: true,
          })
        : undefined),
      ...query,
    };
    window.history[method](null, '', `${pathname}?${qs.stringify(mergedQuery)}`);
  },
  push({ pathname, query, merged }: { pathname: string; query?: RecordType; merged?: boolean }) {
    this._base({ method: 'pushState', pathname, query, merged });
  },
  replace({ pathname, query, merged }: { pathname: string; query?: RecordType; merged?: boolean }) {
    this._base({ method: 'replaceState', pathname, query, merged });
  },
};

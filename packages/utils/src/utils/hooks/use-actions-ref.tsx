/* eslint-disable no-param-reassign */
import type React from 'react';
import { useRef } from 'react';
import type { RecordType } from '@ty-one-start/typings';

/**
 * 将 api 挂在 ref 上
 * 并且做了一些限制，api 上同名方法的类型必须和 ref 一致
 *
 * @param api
 * @param ref
 * @returns
 */
export const useActionsRef = <API extends Partial<UP>, UP extends RecordType = RecordType>(
  api: API,
  ref?: React.MutableRefObject<UP | undefined | null>,
) => {
  const actions = useRef<API>(api);

  Object.keys(api).forEach((key: keyof API) => {
    actions.current[key] = api[key];
    if (ref) {
      /** 保证 ref 上一定有 api 方法 */
      ref.current = ref.current ?? ({} as UP);
      /** 可能 API 上有自定义的 key，这里直接强转 */
      (ref.current as RecordType)[key as string] = api[key];
    }
  });
  return actions;
};

/* eslint-disable no-param-reassign */
import type React from 'react';
import { useRef } from 'react';
import type { RecordType } from '../../typings';

export const useActionsRef = <API extends RecordType>(
  api: API,
  ref?: React.MutableRefObject<API | undefined | null>,
) => {
  const actions = useRef<API>(api);

  Object.keys(api).forEach((key: keyof API) => {
    actions.current[key] = api[key];
    if (ref) {
      ref.current = ref.current ?? ({} as API);
      ref.current[key] = api[key];
    }
  });
  return actions;
};

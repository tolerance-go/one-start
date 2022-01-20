import utl from 'lodash';
import { useRef } from 'react';
import type { RecordType } from '../../typings';

export const useRefObject = () => {
  const ref = useRef<RecordType>({});

  const coreSetRefObject = (param: RecordType) => {
    ref.current = param;
    return ref.current;
  };

  const setRefObject = (param: RecordType | ((prev: RecordType) => RecordType)) => {
    if (typeof param === 'function') {
      return coreSetRefObject(param(ref.current));
    }
    return coreSetRefObject(param);
  };

  return {
    setRefObject,
    getRefObject: () => {
      return ref.current;
    },
    mergeRefObject: (param: RecordType) => {
      return setRefObject((prev) => utl.merge({}, prev, param));
    },
  };
};

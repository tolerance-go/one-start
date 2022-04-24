import type { useLayoutEffect } from 'react';
import { useRef, useEffect } from 'react';

type effectHookType = typeof useEffect | typeof useLayoutEffect;

const createUpdateEffect: (hook: effectHookType) => effectHookType = (hook) => (effect, deps) => {
  const isMounted = useRef(false);

  // for react-refresh
  hook(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // eslint-disable-next-line consistent-return
  hook(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export const useUpdateEffect = createUpdateEffect(useEffect);

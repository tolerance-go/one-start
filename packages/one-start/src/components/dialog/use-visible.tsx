import { useEffect, useRef, useState } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';

export const useVisible = ({
  onVisibleChange,
  initialVisible,
}: {
  onVisibleChange?: (visible: boolean) => void;
  initialVisible?: boolean;
}) => {
  const [visible, setVisible] = useState(initialVisible ?? false);
  const mountedRef = useRef(false);

  const promiseActionsRef = useRef<{
    resolve: (result: boolean | PromiseLike<boolean>) => void;
    reject: () => void;
  }>({
    resolve: () => {},
    reject: () => {},
  });
  const createPromise = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      promiseActionsRef.current.reject = reject;
      promiseActionsRef.current.resolve = resolve;
    });
  };
  const promiseRef = useRef<Promise<boolean>>();
  const initPromise = () => {
    if (promiseRef.current) return;
    promiseRef.current = createPromise();
  };

  const resolvePromise = (result: boolean) => {
    promiseActionsRef.current.resolve(result);
    promiseRef.current = undefined;
  };

  const close = async () => {
    setVisible(false);
    resolvePromise(false);
  };

  const actionsRef = useActionsRef({
    propVisibleChange: onVisibleChange,
  });

  useEffect(() => {
    if (mountedRef.current) {
      actionsRef.current.propVisibleChange?.(visible);
    }
  }, [actionsRef, visible]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  return {
    visible,
    promiseRef,
    createPromise,
    initPromise,
    close,
    setVisible,
  };
};

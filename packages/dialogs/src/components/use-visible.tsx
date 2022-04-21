import { useEffect, useRef, useState } from 'react';
import type { RecordType } from '@ty-one-start/typings';
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
    resolve: (result: RecordType | PromiseLike<RecordType | void> | void) => void;
    reject: () => void;
  }>({
    resolve: () => {},
    reject: () => {},
  });
  const createPromise = (): Promise<RecordType | void> => {
    return new Promise((resolve, reject) => {
      promiseActionsRef.current.reject = reject;
      promiseActionsRef.current.resolve = resolve;
    });
  };
  const promiseRef = useRef<Promise<RecordType | void>>();
  const initPromise = () => {
    if (promiseRef.current) return;
    promiseRef.current = createPromise();
  };

  const resolvePromise = (result?: RecordType) => {
    promiseActionsRef.current.resolve(result);
    promiseRef.current = undefined;
  };

  const close = async (result?: RecordType) => {
    setVisible(false);
    resolvePromise(result);
  };

  const open = async () => {
    initPromise();
    setVisible(true);
  };

  const pending = <T extends RecordType | void>(): Promise<T> | undefined => {
    return promiseRef.current as Promise<T> | undefined;
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
    open,
    setVisible,
    pending,
  };
};

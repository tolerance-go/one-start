/** confirm hooks 中没有 visible，也没有 promise */
import { useEffect, useRef, useState } from 'react';
import { useActionsRef } from '@ty-one-start/utils';
import type { RequestIO, OSResMessage } from '@ty-one-start/typings';
import { logRequestMessage } from '@ty-one-start/utils';
import { normalizeRequestOutputs } from '@ty-one-start/utils';

export const useConfirm = ({
  onVisibleChange,
  initialVisible,
  requestAfterConfirm,
  requestAfterCancel,
}: {
  onVisibleChange?: (visible: boolean) => void;
  initialVisible?: boolean;
  requestAfterConfirm?: RequestIO<
    void,
    {
      message?: OSResMessage;
    }
  >;
  requestAfterCancel?: RequestIO<void, undefined>;
}) => {
  const [visible, setVisible] = useState(initialVisible ?? false);
  const [requestAfterConfirmLoading, setRequestAfterConfirmLoading] = useState(false);
  const [requestAfterCancelLoading, setRequestAfterCancelLoading] = useState(false);
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
  const [cancelButtonDisabled, setCancelButtonDisabled] = useState(false);

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

  const cancel = async () => {
    if (requestAfterCancel) {
      setConfirmButtonDisabled(true);
      setRequestAfterCancelLoading(true);
      const { error } = await requestAfterCancel().then(normalizeRequestOutputs);
      setRequestAfterCancelLoading(false);
      setConfirmButtonDisabled(false);
      if (!error) {
        setVisible(false);
        resolvePromise(false);
        return true;
      }
    } else {
      setVisible(false);
      resolvePromise(false);
      return true;
    }
    return false;
  };

  const confirm = async () => {
    if (requestAfterConfirm) {
      setCancelButtonDisabled(true);
      setRequestAfterConfirmLoading(true);
      const { error } = await requestAfterConfirm()
        .then(normalizeRequestOutputs)
        .then(logRequestMessage());
      setRequestAfterConfirmLoading(false);
      setCancelButtonDisabled(false);
      if (!error) {
        setVisible(false);
        resolvePromise(true);
        return true;
      }
    } else {
      setVisible(false);
      resolvePromise(true);
      return true;
    }
    return false;
  };

  const close = () => {
    setVisible(false);
    resolvePromise(false);
  };

  const actionsRef = useActionsRef({
    propVisibleChange: onVisibleChange,
  });

  useEffect(() => {
    actionsRef.current.propVisibleChange?.(visible);
  }, [actionsRef, visible]);

  return {
    visible,
    requestAfterConfirmLoading,
    requestAfterCancelLoading,
    confirmButtonDisabled,
    cancelButtonDisabled,
    promiseRef,
    resolvePromise,
    createPromise,
    initPromise,
    close,
    cancel,
    confirm,
    setVisible,
  };
};

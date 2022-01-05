import { Popconfirm } from '@ty/antd';
import { useClickAway } from 'ahooks';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import type { OSDialogPopconfirmAPI, OSDialogPopconfirmType } from '../../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useConfirm } from './use-confirm';
import { renderTrigger } from './utils';

const OSDialogPopconfirm: React.ForwardRefRenderFunction<
  OSDialogPopconfirmAPI,
  PropsWithChildren<OSDialogPopconfirmType>
> = (props, ref) => {
  const { settings, actionsRef: propActionsRef, requests } = props;
  const { requestAfterCancel, requestAfterConfirm } = requests ?? {};
  const clsPrefix = useClsPrefix('popconfirm');

  const {
    visible,
    promiseRef,
    confirm,
    initPromise,
    cancel,
    close,
    setVisible,
    requestAfterConfirmLoading,
    requestAfterCancelLoading,
    cancelButtonDisabled,
    confirmButtonDisabled,
  } = useConfirm({
    requestAfterCancel,
    requestAfterConfirm,
  });

  useImperativeHandle(ref, () => {
    return {
      push: async () => {
        setVisible(true);
        initPromise();
        const confirmed = await promiseRef.current!;
        return {
          confirmed,
        };
      },
      pop: () => {
        close();
      },
      update: () => {},
    };
  });

  useActionsRef(
    {
      setVisible,
    },
    propActionsRef,
  );

  const wrapperSpanRef = useRef<HTMLSpanElement>(null);
  const [unionId] = useState(() => Math.random().toString());
  useClickAway(() => {
    if (visible) {
      close();
    }
  }, [wrapperSpanRef, () => document.getElementById(unionId)]);

  return (
    <Popconfirm
      id={unionId}
      overlayClassName={`${clsPrefix}-overlay`}
      visible={visible}
      title={props.settings?.title}
      onConfirm={() => {
        confirm();
      }}
      onCancel={() => {
        cancel();
      }}
      placement={settings?.placement}
      okButtonProps={{
        loading: requestAfterConfirmLoading,
        disabled: confirmButtonDisabled,
      }}
      cancelButtonProps={{
        loading: requestAfterCancelLoading,
        disabled: cancelButtonDisabled,
      }}
    >
      <span ref={wrapperSpanRef}>{renderTrigger(props.children)}</span>
    </Popconfirm>
  );
};

export default React.forwardRef(OSDialogPopconfirm);

import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import React, { useContext, useImperativeHandle, useRef } from 'react';
import { OSReferencesCollectorDispatchContext } from '../providers/references';
import type {
  OSDialogAPI,
  OSDialogMessageAPI,
  OSDialogModalAPI,
  OSDialogModalOperationAPI,
  OSDialogPopconfirmAPI,
  OSDialogPopoverAPI,
  OSDialogType,
  OSDialogMessageType,
  OSDialogPopoverType,
  OSDialogPopconfirmType,
  OSDialogModalType,
  OSDialogDrawerType,
  OSDialogModalOperationType,
  OSDialogAPIBase,
  OSDialogDrawerAPI,
} from '../../typings';
import { OSDialogAPIContext, OSDialogTypeContext } from './contexts';
import OSDialogMessage from './message';
import OSDialogModal from './modal';
import OSDialogModalOperation from './modal-operation';
import OSDialogPopconfirm from './popconfirm';
import OSDialogPopover from './popover';
import OSDialogDrawer from './drawer';

const OSDialog: React.ForwardRefRenderFunction<OSDialogAPI, PropsWithChildren<OSDialogType>> = (
  props,
  ref,
) => {
  const innerRef = useRef<OSDialogAPI>(null);

  const referencesDispatch = useContext(OSReferencesCollectorDispatchContext);

  useImperativeHandle(ref, () => {
    const apis: OSDialogAPI = innerRef.current!;
    return apis;
  });

  useEffect(() => {
    const apis: OSDialogAPI = innerRef.current!;
    if (props.refKey) {
      if (props.type === 'message') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'dialogs.messages',
            key: props.refKey,
            apis: apis as OSDialogMessageAPI,
          },
        });
      }

      if (props.type === 'popover') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'dialogs.popovers',
            key: props.refKey,
            apis: apis as OSDialogPopoverAPI,
          },
        });
      }

      if (props.type === 'popconfirm') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'dialogs.popconfirms',
            key: props.refKey,
            apis: apis as OSDialogPopconfirmAPI,
          },
        });
      }

      if (props.type === 'modal') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'dialogs.modals',
            key: props.refKey,
            apis: apis as OSDialogModalAPI,
          },
        });
      }

      if (props.type === 'modal-operation') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'dialogs.modalOperations',
            key: props.refKey,
            apis: apis as OSDialogModalOperationAPI,
          },
        });
      }

      if (props.type === 'drawer') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'dialogs.drawers',
            key: props.refKey,
            apis: apis as OSDialogDrawerAPI,
          },
        });
      }
    }
  });

  const renderContent = () => {
    if (props.type === 'popover') {
      return <OSDialogPopover ref={innerRef} {...props}></OSDialogPopover>;
    }

    if (props.type === 'popconfirm') {
      return (
        <OSDialogPopconfirm
          ref={innerRef as React.MutableRefObject<OSDialogModalOperationAPI>}
          {...props}
        ></OSDialogPopconfirm>
      );
    }

    if (props.type === 'message') {
      return (
        <OSDialogMessage
          ref={innerRef as React.MutableRefObject<OSDialogMessageAPI>}
          {...props}
        ></OSDialogMessage>
      );
    }

    if (props.type === 'modal') {
      return (
        <OSDialogModal
          ref={innerRef as React.MutableRefObject<OSDialogModalAPI>}
          {...props}
        ></OSDialogModal>
      );
    }

    if (props.type === 'drawer') {
      return (
        <OSDialogDrawer
          ref={innerRef as React.MutableRefObject<OSDialogDrawerAPI>}
          {...props}
        ></OSDialogDrawer>
      );
    }

    if (props.type === 'modal-operation') {
      return (
        <OSDialogModalOperation
          ref={innerRef as React.MutableRefObject<OSDialogModalOperationAPI>}
          {...props}
        ></OSDialogModalOperation>
      );
    }

    return null;
  };

  return (
    <OSDialogTypeContext.Provider value={props.type}>
      <OSDialogAPIContext.Provider value={innerRef}>{renderContent()}</OSDialogAPIContext.Provider>
    </OSDialogTypeContext.Provider>
  );
};

export default React.forwardRef(OSDialog);

export const DialogAPIBase: React.FC<OSDialogAPIBase> = () => <></>;
export const DialogMessageSettings: React.FC<OSDialogMessageType['settings']> = () => <></>;
export const DialogMessageAPI: React.FC<OSDialogMessageAPI> = () => <></>;
export const DialogPopoverSettings: React.FC<OSDialogPopoverType['settings']> = () => <></>;
export const DialogPopoverAPI: React.FC<OSDialogPopoverAPI> = () => <></>;
export const DialogPopconfirmSettings: React.FC<OSDialogPopconfirmType['settings']> = () => <></>;
export const DialogPopconfirmAPI: React.FC<OSDialogPopconfirmAPI> = () => <></>;
export const DialogPopconfirmRequests: React.FC<OSDialogPopconfirmType['requests']> = () => <></>;
export const DialogModalSettings: React.FC<OSDialogModalType['settings']> = () => <></>;
export const DialogModalAPI: React.FC<OSDialogModalAPI> = () => <></>;
export const DialogmodalOperationSettings: React.FC<OSDialogModalOperationType['settings']> =
  () => <></>;
export const DialogModalOperationAPI: React.FC<OSDialogModalOperationAPI> = () => <></>;
export const DialogModalOperationRequests: React.FC<OSDialogModalOperationType['requests']> =
  () => <></>;

export const DialogDrawerAPI: React.FC<OSDialogDrawerAPI> = () => <></>;
export const DialogDrawerRequests: React.FC<OSDialogDrawerType['requests']> = () => <></>;
export const DialogDrawerSettings: React.FC<OSDialogDrawerType['settings']> = () => <></>;

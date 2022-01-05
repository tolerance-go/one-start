import type { DrawerProps, ModalFuncProps, PopconfirmProps } from '@ty/antd';
import type { ArgsProps } from '@ty/antd/lib/message';
import type React from 'react';
import type { OSTriggerType } from './trigger';
import type { OSCore, RequestIO } from './core';
import type { RecordType } from '../core';
import type { OSResMessage } from './message';
import type { RcFile } from '@ty/antd/lib/upload';

export interface OSDialogAPIBase {
  push: (settings?: RecordType) => Promise<RecordType | void>;
  pop: () => void;
  update: (settings?: RecordType) => void;
}

export type OSDialogBase = OSCore;

export interface OSDialogMessageAPI extends OSDialogAPIBase {
  push: (settings?: OSDialogMessageType['settings']) => Promise<void>;
}

export interface OSDialogMessageType extends OSDialogBase {
  type?: 'message';
  settings?: {
    title?: string;
    type?: ArgsProps['type'];
  };
}

export type OSDialogPopconfirmActionsType = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface OSDialogPopconfirmAPI extends OSDialogAPIBase {
  push: () => Promise<{ confirmed: boolean }>;
}

export interface OSDialogPopconfirmType extends OSDialogBase {
  type?: 'popconfirm';
  settings?: {
    title?: string;
    icon?: React.ReactNode;
    placement?: PopconfirmProps['placement'];
  };
  requests?: {
    requestAfterConfirm?: RequestIO<
      void,
      {
        message?: OSResMessage;
      }
    >;
    requestAfterCancel?: RequestIO<void, undefined>;
  };
  actionsRef?: React.MutableRefObject<OSDialogModalOperationActionsType | null>;
}

export type OSDialogPopoverActionsType = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export type OSDialogPopoverAPI = OSDialogAPIBase;

export interface OSDialogPopoverType extends OSDialogBase {
  type?: 'popover';
  settings?: {
    title?: React.ReactNode;
    icon?: React.ReactNode;
    content?: React.ReactNode;
    placement?: PopconfirmProps['placement'];
    initialVisible?: boolean;
    align?: PopconfirmProps['align'];
    arrowPointAtCenter?: PopconfirmProps['arrowPointAtCenter'];
  };
  onVisibleChange?: (visible: boolean) => void;
  actionsRef?: React.MutableRefObject<OSDialogPopoverActionsType | null>;
}

export type OSDialogModalActionsType = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export type OSDialogModalAPI = OSDialogAPIBase;

export interface OSDialogModalType extends OSDialogBase {
  type?: 'modal';
  settings?: {
    title?: string | React.ReactNode;
    body?: React.ReactNode;
    width?: string | number;
    footer?: React.ReactNode;
    initialVisible?: boolean;
  };
  destroyOnClose?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  forceRender?: boolean;
  actionsRef?: React.MutableRefObject<OSDialogModalActionsType | null>;
}

export type OSDialogDrawerAPI = OSDialogAPIBase;

export interface OSDialogDrawerType extends OSDialogBase {
  type?: 'drawer';
  settings?: {
    title?: string | React.ReactNode;
    body?: React.ReactNode;
    width?: string | number;
    footer?: React.ReactNode;
    initialVisible?: boolean;
    modalMask?: boolean | 'transparent';
  };
  onVisibleChange?: (visible: boolean) => void;
  forceRender?: boolean;
  destroyOnClose?: DrawerProps['destroyOnClose'];
}

export type OSDialogModalOperationActionsType = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface OSDialogModalOperationAPI extends OSDialogAPIBase {
  push: () => Promise<{ confirmed: boolean }>;
}

export interface OSDialogModalOperationType extends OSDialogBase {
  type?: 'modal-operation';
  settings?: {
    width?: string | number;
    icon?: React.ReactNode;
    title?: string | React.ReactNode;
    content?: React.ReactNode;
    danger?: boolean;
    type?: ModalFuncProps['type'];
    actions?: React.ReactElement[];
    confirmTriggerSettings?: Required<OSTriggerType>['settings'];
    confirmTriggerWrapper?: React.ReactElement;
  };
  requests?: {
    requestAfterConfirm?: RequestIO<
      void,
      {
        message?: OSResMessage;
      }
    >;
    requestAfterCancel?: RequestIO<void, undefined>;
    requestBeforeUpload?: RequestIO<
      {
        type: 'confirm' | 'cancel';
        files: RcFile[];
      },
      {
        message?: OSResMessage;
      }
    >;
  };
  actionsRef?: React.MutableRefObject<OSDialogModalOperationActionsType | null>;
  onVisibleChange?: (visible: boolean) => void;
}

export type OSDialogType =
  | OSDialogMessageType
  | OSDialogPopoverType
  | OSDialogPopconfirmType
  | OSDialogModalOperationType
  | OSDialogModalType
  | OSDialogDrawerType;

export type OSDialogAPI =
  | OSDialogModalOperationAPI
  | OSDialogMessageAPI
  | OSDialogPopconfirmAPI
  | OSDialogPopoverAPI
  | OSDialogModalAPI
  | OSDialogDrawerAPI;

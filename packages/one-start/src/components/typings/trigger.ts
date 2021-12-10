import type { ButtonProps, UploadProps } from '@ty/antd';
import type { DropdownButtonProps } from '@ty/antd/lib/dropdown';
import { RcFile } from '@ty/antd/lib/upload';
import type React from 'react';
import type { OSCore, RecordType, RequestIO } from './core';
import { OSResMessage } from './message';

export interface OSTriggerBase extends OSCore {}

export type OSTriggerAPIBase = {
  update: (settings?: RecordType) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDisabled: (disabled: boolean) => void;
};

export interface OSMenuItem {
  type?: 'item-group' | 'sub-menu' | 'item';
  key?: string;
  text?: string | React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
  children?: OSMenuItem[];
  upload?: OSTriggerUpload;
  menu?: OSMenuItem[];
  tooltip?: OSTriggerTooltip;
}

export type OSButtonCore = {
  text?: string | React.ReactNode;
  disabled?: boolean;
  initialDisabled?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
  tooltip?: OSTriggerTooltip;
  /**
   * 是否手动控制包裹的 dialog 弹出
   * @default false
   */
  manualPush?: boolean;
};

export interface OSTriggerDropdownAPI extends OSTriggerAPIBase {
  update: (settings?: OSTriggerDropdownType['settings']) => void;
}

export type OSTriggerDropdownSettingsCore = {
  menu?: OSMenuItem[];
  plain?: boolean;
  block?: boolean;
  trigger?: ('click' | 'hover' | 'contextMenu')[];
  upload?: OSTriggerUpload;
  menuVisible?: boolean;
} & OSButtonCore;

export interface OSTriggerDropdownType extends OSTriggerBase {
  type?: 'dropdown';
  settings?:
    | ({
        /** 设置主副按钮 */
        split?: false;
        type?: ButtonProps['type'];
      } & OSTriggerDropdownSettingsCore)
    | ({
        /** 设置主副按钮 */
        split?: true;
        type?: DropdownButtonProps['type'];
      } & OSTriggerDropdownSettingsCore);
  requests?: {
    requestMenuData?: RequestIO<void, OSMenuItem[]>;
    requestAfterClick?: RequestIO<
      {
        actions: OSTriggerDropdownAPI;
      },
      {
        message?: OSResMessage;
      }
    >;
    requestAfterMenuClick?: RequestIO<
      {
        key: string;
        keyPath: string[];
      },
      undefined
    >;
    requestBeforeUpload?: RequestIO<
      {
        files: RcFile[];
        key?: string;
        keyPath?: string[];
      },
      {
        message?: OSResMessage;
      }
    >;
  };
  __shouldPush?: boolean;
  __disabled?: boolean;
  onMenuClick?: (options: { key: string; keyPath: string[] }) => void;
  onClick?: (options: {
    event?: React.MouseEvent<HTMLElement, MouseEvent>;
    actions: OSTriggerDropdownAPI;
  }) => void;
  actionsRef?: React.MutableRefObject<(OSTriggerDropdownAPI & Record<string, Function>) | null>;
}

export interface OSTriggerButtonAPI extends OSTriggerAPIBase {
  update: (settings?: OSTriggerButtonType['settings']) => void;
}

export type OSTriggerTooltip = string | string[];

export type OSTriggerUpload = {
  /** 允许的文件格式后缀 */
  suffixs?: string[];
  maxCount?: UploadProps['maxCount'];
  multiple?: UploadProps['multiple'];
  directory?: UploadProps['directory'];
};

export interface OSTriggerButtonType extends OSTriggerBase {
  type?: 'button';
  settings?: OSButtonCore & {
    type?: ButtonProps['type'];
    block?: ButtonProps['block'];
    /** 纯文本模式 */
    plain?: boolean;
    upload?: OSTriggerUpload;
  };
  requests?: {
    /** 同步后调用，会设置 icon 的 spin */
    requestAfterSync?: RequestIO<void, undefined>;
    requestAfterClick?: RequestIO<
      {
        actions: OSTriggerButtonAPI;
      },
      {
        message?: OSResMessage;
      }
    >;
    requestAfterProcessing?: RequestIO<void, undefined>;
    requestBeforeUpload?: RequestIO<
      {
        files: RcFile[];
      },
      {
        message?: OSResMessage;
      }
    >;
  };
  __shouldPush?: boolean;
  __disabled?: boolean;
  loading?: boolean;
  onClick?: (options: {
    event?: React.MouseEvent<HTMLElement, MouseEvent>;
    actions: OSTriggerButtonAPI;
  }) => void;
  actionsRef?: React.MutableRefObject<(OSTriggerButtonAPI & Record<string, Function>) | null>;
}

export type OSTriggerType = OSTriggerButtonType | OSTriggerDropdownType;

export type OSTriggerAPI = OSTriggerButtonAPI | OSTriggerDropdownAPI;

import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import type { BadgeProps, ButtonProps, UploadProps } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import type { RibbonProps } from 'antd/lib/badge/Ribbon';
import type { DropdownButtonProps } from 'antd/lib/dropdown';
import type { RcFile } from 'antd/lib/upload';
import type React from 'react';
import type { RecordType } from '../core';
import type { OSCore, RequestIO } from './core';
import type { OSResMessage } from './message';

export type OSTriggerBase = OSCore;

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
  badge?:
    | {
        type: 'count';
        settings?: BadgeProps;
      }
    | {
        type: 'ribbon';
        settings?: RibbonProps;
      };
  badgeWrapperStyle?: React.CSSProperties;
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
  size?: SizeType;
  /** html id */
  id?: string;
  /** 样式标记 */
  className?: string;
};

export interface OSTriggerDropdownAPI extends OSTriggerAPIBase {
  update: (settings?: OSTriggerDropdownType['settings']) => void;
}

export type OSTriggerDropdownSettingsCore = {
  menu?: OSMenuItem[];
  plain?: boolean;
  block?: boolean;
  upload?: OSTriggerUpload;
  overlayZIndex?: number;
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
        /** 附属 icon */
        affiliateIcon?: React.ReactNode | ((options: { dom: React.ReactNode }) => React.ReactNode);
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
  className?: string;
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

export interface OSTriggerIconAPI extends OSTriggerAPIBase {}

export interface OSTriggerIconType extends OSTriggerBase {
  type?: 'icon';
  settings?: {
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    content?: React.ReactElement<AntdIconProps>;
    loading?: string;
    manualPush?: boolean;
    disabled?: boolean;
    initialDisabled?: boolean;
    upload?: OSTriggerUpload;
  } & OSButtonCore;
  requests?: {
    requestAfterClick?: RequestIO<
      {
        actions: OSTriggerIconAPI;
      },
      {
        message?: OSResMessage;
      }
    >;
  };
  __shouldPush?: boolean;
  __disabled?: boolean;
  className?: string;
  onClick?: (options: {
    event?: React.MouseEvent<HTMLElement, MouseEvent>;
    actions: OSTriggerIconAPI;
  }) => void;
  actionsRef?: React.MutableRefObject<(OSTriggerIconAPI & Record<string, Function>) | null>;
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
    /** 是否 loading 的时候不显示 icon */
    mergeIconInLoading?: boolean;
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
  /** @deprecated 请用 settings.className 代替 */
  className?: string;
  actionsRef?: React.MutableRefObject<(OSTriggerButtonAPI & Record<string, Function>) | null>;
  onClick?: (options: {
    event?: React.MouseEvent<HTMLElement, MouseEvent>;
    actions: OSTriggerButtonAPI;
  }) => void;
}

export type OSTriggerType = OSTriggerButtonType | OSTriggerDropdownType | OSTriggerIconType;

export type OSTriggerAPI = OSTriggerButtonAPI | OSTriggerDropdownAPI | OSTriggerIconAPI;

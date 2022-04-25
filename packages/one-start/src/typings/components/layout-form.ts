import type { FormInstance } from '@ty/antd/es/form/Form';
import type { FieldError, NamePath, ValidateErrorEntity } from 'rc-field-form/lib/interface';
import type { RequiredRecursion } from '../utils';
import type { OSCore } from './core';
import type { OSDialogModalType } from './dialog';
import type { RecordType } from '../core';
import type {
  CreatePureFormFieldItemConfigsType,
  CreateStaticPureFormFieldItemConfigsType,
  OSFormAPI,
  _OSFormType,
} from './form';
import type { OSTriggerButtonType } from './trigger';
import type { RequestIO } from './core';
import type { OSResMessage } from './message';
import type { ReactNode } from 'react';

export type OSLayoutFormAPIBase = OSFormAPI;

export type OSLayoutFormBase<
  CustomValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> = Pick<_OSFormType<CustomValueType, StaticCustomValueType>, 'value' | 'onChange'> & OSCore;

export type OSLayoutModalFormAPI = OSLayoutFormAPIBase;

export type _OSLayoutModalFormType<
  CustomValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> = OSLayoutFormBase<CustomValueType, StaticCustomValueType> & {
  type?: 'modal-form';
  settings?: {
    /** 触发按钮文案 */
    buttonTriggerText?: string;
    /** 表单 item 配置 */
    formFieldItems?: RequiredRecursion<
      _OSFormType<CustomValueType, StaticCustomValueType>
    >['settings']['fieldItems'];
    /** 拟态框配置 */
    modalDialogSettings?: OSDialogModalType['settings'];
    /** 按钮触发器配置 */
    buttonTriggerSettings?: OSTriggerButtonType['settings'];
    /** 表单配置 */
    formSettings?: _OSFormType<CustomValueType, StaticCustomValueType>['settings'];
  } & Pick<Required<_OSFormType<CustomValueType, StaticCustomValueType>>['settings'], 'params'>;
  requests?: {
    /** 请求表单初始化数据 */
    requestFormDataSource?: RequiredRecursion<
      _OSFormType<CustomValueType, StaticCustomValueType>
    >['requests']['requestDataSource'];
    /** 获取自定义字段 */
    requestFieldItems?: RequiredRecursion<
      _OSFormType<CustomValueType, StaticCustomValueType>
    >['requests']['requestFieldItems'];
  };
  onVisibleChange?: (visible: boolean) => void;
  formWrapperClassName?: string;
};

export type OSLayoutTabsFormAPI = Pick<
  OSLayoutFormAPIBase,
  'setDataSource' | 'getDataSource' | 'clearPrevUserCellInputs'
> & {
  validate: () => Promise<
    | {
        error: false;
        data: Record<string, RecordType>;
      }
    | {
        error: true;
        data: Record<string, ValidateErrorEntity | RecordType>;
      }
  >;
  validateRecursion: () => Promise<
    | {
        error: false;
        data: Record<string, RecordType>;
      }
    | {
        error: true;
        data: Record<string, ValidateErrorEntity | RecordType>;
      }
  >;
  getFieldsError: (tabKey?: string, nameList?: NamePath[]) => Record<string, FieldError[]>;
} & Pick<FormInstance, 'getFieldsValue' | 'setFieldsValue' | 'resetFields'>;

export interface OSTabsItemType {
  title?: string;
  key?: string;
}
export type _OSLayoutTabsFormType<
  CustomValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> = OSLayoutFormBase<CustomValueType, StaticCustomValueType> & {
  type?: 'tabs-form';
  settings?: {
    /** tab title */
    tabs?: OSTabsItemType[];
    /** 表单设置和 tabs 映射 */
    forms?: Record<string, _OSFormType<CustomValueType, StaticCustomValueType>>;
    /** 内容可以收缩 */
    collapsable?: boolean;
  };
  requests?: {
    /** 请求表单初始化数据 */
    requestTabsFormDataSource?: RequiredRecursion<
      _OSFormType<CustomValueType, StaticCustomValueType>
    >['requests']['requestDataSource'];
  };
  tabClassName?: string;
};

export type OSLayoutStepsFormAPI = Pick<
  OSLayoutFormAPIBase,
  'setDataSource' | 'getDataSource' | 'clearPrevUserCellInputs'
> & {
  resetStepsForm: () => void;
  validate: () => Promise<
    | {
        error: false;
        data: RecordType;
      }
    | {
        error: true;
        data: ValidateErrorEntity;
      }
  >;
  validateRecursion: () => Promise<
    | {
        error: false;
        data: RecordType;
      }
    | {
        error: true;
        data: ValidateErrorEntity;
      }
  >;
  getFieldsError: (tabKey?: string, nameList?: NamePath[]) => Record<string, FieldError[]>;
} & Pick<FormInstance, 'getFieldsValue' | 'setFieldsValue' | 'resetFields'>;

export interface OSStepsItemType {
  title?: string;
  key?: string;
}

export type _OSLayoutStepsFormType<
  CustomValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> = OSLayoutFormBase<CustomValueType, StaticCustomValueType> & {
  type?: 'steps-form';
  settings?: {
    /** tab title */
    steps?: OSStepsItemType[];
    /** 表单设置和 steps 映射 */
    forms?: Record<string, _OSFormType<CustomValueType, StaticCustomValueType>>;
    /** 确认提交的按钮文案 */
    submitTriggerText?: string;
    /** 默认 step 起点 */
    defaultCurrent?: number;
  };
  requests?: {
    /** 请求表单初始化数据 */
    requestStepsFormDataSource?: RequiredRecursion<
      _OSFormType<CustomValueType, StaticCustomValueType>
    >['requests']['requestDataSource'];
    /** 当步骤表单完成，触发最后提交 */
    requestWhenSubmit?: RequestIO<
      {
        values: RecordType;
      },
      {
        message?: OSResMessage;
      }
    >;
    /** 当准备进入下一步时触发 */
    requestWhenNext?: RequestIO<
      {
        values: RecordType;
        current: number;
        currentValues: RecordType;
        formsRef: React.RefObject<React.MutableRefObject<OSFormAPI | null>[]>;
      },
      {
        message?: OSResMessage;
      }
    >;
    /** 异步请求初始化数据 */
    requestInitialValues?: RequestIO<void, RecordType>;
  };
  slots?: {
    renderExtraActions?: (options: {
      current: number;
      formsRef: React.RefObject<React.MutableRefObject<OSFormAPI | null>[]>;
      apisRef: React.RefObject<OSLayoutStepsFormAPI | null>;
    }) => ReactNode;
  };
};

export type _OSLayoutFormType<
  CustomValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> =
  | _OSLayoutModalFormType<CustomValueType, StaticCustomValueType>
  | _OSLayoutTabsFormType<CustomValueType, StaticCustomValueType>
  | _OSLayoutStepsFormType<CustomValueType, StaticCustomValueType>;

export type OSLayoutFormAPI = OSLayoutModalFormAPI | OSLayoutTabsFormAPI;

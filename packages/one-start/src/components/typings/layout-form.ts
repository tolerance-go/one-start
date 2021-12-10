import { FormInstance } from '@ty/antd/es/form/Form';
import { FieldError, NamePath, ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { RequiredRecursion } from '../utils/typings';
import type { OSCore, RecordType } from './core';
import type { OSDialogModalType } from './dialog';
import type {
  OSFormAPI,
  _OSFormType,
  CreateStaticPureFormFieldItemConfigsType,
  CreatePureFormFieldItemConfigsType,
} from './form';
import type { OSTriggerButtonType } from './trigger';

export interface OSLayoutFormAPIBase extends OSFormAPI {}

export interface OSLayoutFormBase extends OSCore {}

export interface OSLayoutModalFormAPI extends OSLayoutFormAPIBase {}

export interface _OSLayoutModalFormType<
  CustomValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> extends OSLayoutFormBase {
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
  };
  requests?: {
    /** 请求表单初始化数据 */
    requestFormDataSource?: RequiredRecursion<
      _OSFormType<CustomValueType, StaticCustomValueType>
    >['requests']['requestDataSource'];
  };
  value?: RecordType;
  onChange?: (value?: RecordType) => void;
  onVisibleChange?: (visible: boolean) => void;
}

export type OSLayoutTabsFormAPI = Pick<OSLayoutFormAPIBase, 'setDataSource' | 'getDataSource'> & {
  validate: () => Promise<
    Record<
      string,
      | {
          error: false;
          data: RecordType;
        }
      | {
          error: true;
          data: ValidateErrorEntity;
        }
    >
  >;
  getFieldsError: (tabKey?: string, nameList?: NamePath[]) => Record<string, FieldError[]>;
} & Pick<FormInstance, 'getFieldsValue' | 'setFieldsValue' | 'resetFields'>;

export interface OSTabsItemType {
  title?: string;
  key?: string;
}
export interface _OSLayoutTabsFormType<
  CustomValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> extends OSLayoutFormBase {
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
  value?: RecordType;
  onChange?: (value?: RecordType) => void;
}

export type _OSLayoutFormType<
  CustomValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> =
  | _OSLayoutModalFormType<CustomValueType, StaticCustomValueType>
  | _OSLayoutTabsFormType<CustomValueType, StaticCustomValueType>;

export type OSLayoutFormAPI = OSLayoutModalFormAPI | OSLayoutTabsFormAPI;

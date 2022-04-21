import type { FormInstance } from '@ty/antd/es/form/Form';
import type { RequiredRecursion } from '../utils';
import type { _OSAttachmentTableAPI, _OSAttachmentTableType } from './attachment-table';
import type { RecordType } from '../core';
import type { _OSEditableTableAPI, _OSEditableTableType } from './editable-table';
import type { OSField, OSFieldBaseConfigs, OSFieldBaseSettings } from './field';
import type {
  CreatePureFormFieldItemConfigsType,
  CreateStaticPureFormFieldItemConfigsType,
  OSFormAPI,
  _OSFormType,
} from './form';
import type { OSLayoutFormAPI, _OSLayoutModalFormType, _OSLayoutTabsFormType } from './layout-form';
import type {
  CreatePureTableFormFieldItemConfigsType,
  CreateStaticPureTableFormFieldItemConfigsType,
  OSTableChangeValueType,
} from './table';

export type _OSEditableTableFieldAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  | _OSEditableTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>
  | HTMLSpanElement;
export type OSEditableTableFieldValueType = OSTableChangeValueType;
export type OSEditableTableFieldChangeValueType = OSTableChangeValueType;

type OSEditableTableType = _OSEditableTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;
export interface OSEditableTableFieldType
  extends OSField<OSEditableTableFieldValueType>,
    OSFieldBaseConfigs<OSEditableTableFieldValueType> {
  type?: 'editable-table';
  settings?: OSEditableTableType['settings'] & OSFieldBaseSettings;
  requests?: Partial<
    Omit<
      RequiredRecursion<OSEditableTableType>['requests'],
      'requestNewRecordData' | 'requestRemoveRecord'
    >
  > & {
    requestNewRecordData?: (
      option: Parameters<
        RequiredRecursion<OSEditableTableType>['requests']['requestNewRecordData']
      >[0] & {
        form: FormInstance | null;
      },
    ) => ReturnType<RequiredRecursion<OSEditableTableType>['requests']['requestNewRecordData']>;
    requestRemoveRecord?: (
      option: Parameters<
        RequiredRecursion<OSEditableTableType>['requests']['requestRemoveRecord']
      >[0] & {
        form: FormInstance | null;
      },
    ) => ReturnType<RequiredRecursion<OSEditableTableType>['requests']['requestRemoveRecord']>;
  };
}

export type _OSAttachmentTableFieldAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  | _OSAttachmentTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>
  | HTMLSpanElement;
export type OSAttachmentTableFieldValueType = OSTableChangeValueType;
export type OSAttachmentTableFieldChangeValueType = OSTableChangeValueType;

/** 避免循环依赖 */
type OSAttachmentTableType = _OSAttachmentTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;
export interface OSAttachmentTableFieldType
  extends OSField<OSAttachmentTableFieldValueType>,
    OSFieldBaseConfigs<OSAttachmentTableFieldValueType> {
  type?: 'attachment-table';
  settings?: OSAttachmentTableType['settings'] & OSFieldBaseSettings;
  requests?: Partial<
    Omit<
      RequiredRecursion<OSAttachmentTableType>['requests'],
      'requestNewRecordData' | 'requestRemoveRecord'
    >
  > & {
    requestNewRecordData?: (
      option: Parameters<
        RequiredRecursion<OSAttachmentTableType>['requests']['requestNewRecordData']
      >[0] & {
        form: FormInstance | null;
      },
    ) => ReturnType<RequiredRecursion<OSAttachmentTableType>['requests']['requestNewRecordData']>;
    requestRemoveRecord?: (
      option: Parameters<
        RequiredRecursion<OSAttachmentTableType>['requests']['requestRemoveRecord']
      >[0] & {
        form: FormInstance | null;
      },
    ) => ReturnType<RequiredRecursion<OSAttachmentTableType>['requests']['requestRemoveRecord']>;
  };
}

export type OSLayoutModalFormFieldAPI = OSLayoutFormAPI | HTMLSpanElement;
export type OSLayoutModalFormFieldValueType = RecordType | undefined;
export interface OSLayoutModalFormFieldType
  extends OSField<OSLayoutModalFormFieldValueType>,
    OSFieldBaseConfigs<OSLayoutModalFormFieldValueType> {
  type?: 'layout-modal-form';
  settings?: _OSLayoutModalFormType<
    OSCustomFieldPureFormFieldItemConfigsType,
    OSCustomFieldStaticPureFormFieldItemConfigsType
  >['settings'] &
    OSFieldBaseSettings;
  requests?: _OSLayoutModalFormType<
    OSCustomFieldPureFormFieldItemConfigsType,
    OSCustomFieldStaticPureFormFieldItemConfigsType
  >['requests'];
  onVisibleChange?: _OSLayoutModalFormType<
    OSCustomFieldPureFormFieldItemConfigsType,
    OSCustomFieldStaticPureFormFieldItemConfigsType
  >['onVisibleChange'];
}

export type OSLayoutTabsFormFieldAPI = OSLayoutFormAPI | HTMLSpanElement;
export type OSLayoutTabsFormFieldValueType = RecordType | undefined;
export interface OSLayoutTabsFormFieldType
  extends OSField<OSLayoutTabsFormFieldValueType>,
    OSFieldBaseConfigs<OSLayoutTabsFormFieldValueType> {
  type?: 'layout-tabs-form';
  settings?: _OSLayoutTabsFormType<
    OSCustomFieldPureFormFieldItemConfigsType,
    OSCustomFieldStaticPureFormFieldItemConfigsType
  >['settings'] &
    OSFieldBaseSettings;
  requests?: _OSLayoutTabsFormType<
    OSCustomFieldPureFormFieldItemConfigsType,
    OSCustomFieldStaticPureFormFieldItemConfigsType
  >['requests'];
}

export type OSFormFieldAPI = OSFormAPI | HTMLSpanElement;
export type OSFormFieldValueType = RecordType | undefined;
export interface OSFormFieldType
  extends OSField<OSFormFieldValueType>,
    OSFieldBaseConfigs<OSFormFieldValueType> {
  type?: 'form';
  settings?: _OSFormType<
    OSCustomFieldPureFormFieldItemConfigsType,
    OSCustomFieldStaticPureFormFieldItemConfigsType
  >['settings'] &
    OSFieldBaseSettings;
  requests?: _OSFormType<
    OSCustomFieldPureFormFieldItemConfigsType,
    OSCustomFieldStaticPureFormFieldItemConfigsType
  >['requests'];
}

export type OSCustomFieldStaticPureFormFieldItemConfigsType =
  | CreateStaticPureFormFieldItemConfigsType<OSEditableTableFieldType>
  | CreateStaticPureFormFieldItemConfigsType<OSLayoutModalFormFieldType>
  | CreateStaticPureFormFieldItemConfigsType<OSAttachmentTableFieldType>
  | CreateStaticPureFormFieldItemConfigsType<OSFormFieldType>
  | CreateStaticPureFormFieldItemConfigsType<OSLayoutTabsFormFieldType>;

export type OSCustomFieldPureFormFieldItemConfigsType =
  | CreatePureFormFieldItemConfigsType<OSEditableTableFieldType>
  | CreatePureFormFieldItemConfigsType<OSLayoutModalFormFieldType>
  | CreatePureFormFieldItemConfigsType<OSAttachmentTableFieldType>
  | CreatePureFormFieldItemConfigsType<OSFormFieldType>
  | CreatePureFormFieldItemConfigsType<OSLayoutTabsFormFieldType>;

export type OSCustomFieldStaticPureTableFormFieldItemConfigsType =
  | CreateStaticPureTableFormFieldItemConfigsType<OSEditableTableFieldType>
  | CreateStaticPureTableFormFieldItemConfigsType<OSLayoutModalFormFieldType>
  | CreateStaticPureTableFormFieldItemConfigsType<OSAttachmentTableFieldType>
  | CreateStaticPureTableFormFieldItemConfigsType<OSFormFieldType>
  | CreateStaticPureTableFormFieldItemConfigsType<OSLayoutTabsFormFieldType>;

export type OSCustomFieldPureTableFormFieldItemConfigsType =
  | CreatePureTableFormFieldItemConfigsType<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      OSEditableTableFieldType
    >
  | CreatePureTableFormFieldItemConfigsType<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      OSLayoutModalFormFieldType
    >
  | CreatePureTableFormFieldItemConfigsType<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      OSAttachmentTableFieldType
    >
  | CreatePureTableFormFieldItemConfigsType<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      OSFormFieldType
    >
  | CreatePureTableFormFieldItemConfigsType<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      OSLayoutTabsFormFieldType
    >;

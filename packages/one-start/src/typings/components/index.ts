import type { RecordType } from '../core';
import type {
  _OSAttachmentTableAPI,
  _OSAttachmentTableSelfType,
  _OSAttachmentTableType,
} from './attachment-table';
import type { OSCore } from './core';
import type {
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  _OSAttachmentTableFieldAPI,
  _OSEditableTableFieldAPI,
} from './custom-fields';
import type {
  _OSEditableTableAPI,
  _OSEditableTableSelfType,
  _OSEditableTableType,
} from './editable-table';
import type { OSFieldAPI, OSFieldValueType } from './field';
import type {
  _OSFormFieldItem,
  _OSFormFieldItems,
  _OSFormFieldItemWithStaticPureConfigs,
  _OSFormType,
} from './form';
import type {
  _OSGridAPI,
  _OSGridType,
  _OSSearchGridAPI,
  _OSSearchGridType,
  _OSSourceGridAPI,
  _OSSourceGridType,
} from './grid';
import type {
  _OSLayoutFormType,
  _OSLayoutModalFormType,
  _OSLayoutTabsFormType,
} from './layout-form';
import type {
  _OSSearchTableAPI,
  _OSSearchTableSelfType,
  _OSSearchTableType,
  _OSSourceTableAPI,
  _OSSourceTableSelfType,
  _OSSourceTableType,
  _OSTableAPI,
  _OSTableFormFieldItem,
  _OSTableFormFieldItems,
  _OSTableFormFieldItemSettingsFnOption,
  _OSTableFormFieldItemWithStaticPureConfigs,
  _OSTableFormGroupType,
  _OSTableType,
} from './table';

export type RenderFieldOptions = {
  ref?: React.RefObject<OSFieldAPI>;
  onChangeHook?: (value: OSFieldValueType) => void;
  value?: OSFieldValueType;
  text?: OSFieldValueType;
} & {
  mode: 'edit' | 'read' | 'update';
  type: _OSFormFieldItems<OSCustomFieldPureFormFieldItemConfigsType>[number]['type'];
  fieldSettings: OSCore['settings'];
  requests?: OSCore['requests'];
  props?: RecordType;
};

export type OSFormFieldItemWithStaticPureConfigs =
  _OSFormFieldItemWithStaticPureConfigs<OSCustomFieldStaticPureFormFieldItemConfigsType>;
export type OSFormFieldItem = _OSFormFieldItem<OSCustomFieldPureFormFieldItemConfigsType>;
export type OSFormFieldItems = _OSFormFieldItems<OSCustomFieldPureFormFieldItemConfigsType>;
export type OSFormType = _OSFormType<
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSTableFormFieldItem = _OSTableFormFieldItem<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType
>;
export type OSTableFormFieldItemWithStaticPureConfigs =
  _OSTableFormFieldItemWithStaticPureConfigs<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
export type OSTableFormFieldItems = _OSTableFormFieldItems<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType
>;

export type OSEditableTableType = _OSEditableTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;
export type OSTableType = _OSTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSGridType = _OSGridType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSSourceTableType = _OSSourceTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSSourceGridType = _OSSourceGridType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSSearchGridType = _OSSearchGridType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSSearchTableType = _OSSearchTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSLayoutFormType = _OSLayoutFormType<
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;
export type OSLayoutModalFormType = _OSLayoutModalFormType<
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;
export type OSLayoutTabsFormType = _OSLayoutTabsFormType<
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSEditableTableAPI =
  _OSEditableTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
export type OSSourceTableAPI =
  _OSSourceTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSSearchTableAPI =
  _OSSearchTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
export type OSSearchGridAPI =
  _OSSearchGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
export type OSTableAPI = _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
export type OSGridAPI = _OSGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
export type OSSourceGridAPI =
  _OSSourceGridAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSTableFormFieldItemSettingsFnOption =
  _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSTableFormGroupType =
  _OSTableFormGroupType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSSourceTableSelfType = _OSSourceTableSelfType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSSearchTableSelfType = _OSSearchTableSelfType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSEditableTableFieldAPI =
  _OSEditableTableFieldAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSAttachmentTableFieldAPI =
  _OSAttachmentTableFieldAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSEditableTableSelfType =
  _OSEditableTableSelfType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSAttachmentTableAPI =
  _OSAttachmentTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSAttachmentTableType = _OSAttachmentTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType
>;

export type OSAttachmentTableSelfType =
  _OSAttachmentTableSelfType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export * from './attachment-table';
export * from './core';
export * from './custom-fields';
export * from './dialog';
export * from './editable-table';
export * from './field';
export * from './form';
export * from './form-item';
export * from './frame';
export * from './grid';
export * from './layout';
export * from './layout-form';
export * from './linkage';
export * from './page';
export * from './rules';
// eslint-disable-next-line import/export
export * from './table';
export * from './trigger';
export * from './message';

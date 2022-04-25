import type { FormInstance } from 'antd';
import type React from 'react';
import type { ReactNode } from 'react';
import type { RecordType } from '../core';
import type { OSCore } from './core';
import type { OSCustomFieldPureFormFieldItemConfigsType } from './custom-fields';
import type { OSFieldAPI, OSFieldChangeEventType, OSFieldValueType } from './field';
import type { _OSFormFieldItems } from './form';
import type { OSTableCellMeta } from './table';

export type RenderFieldOptions<ExtraFieldValueType = OSFieldValueType> = {
  ref?: React.RefObject<OSFieldAPI> | ((instance: OSFieldAPI | null) => void);
  onValueChange?: (value: OSFieldValueType) => void;
  onChange?: (event: OSFieldChangeEventType) => void;
  value?: OSFieldValueType | ExtraFieldValueType;
  text?: OSFieldValueType | ExtraFieldValueType;
  mode: 'edit' | 'read' | 'update';
  type: _OSFormFieldItems<OSCustomFieldPureFormFieldItemConfigsType>[number]['type'];
  fieldSettings: OSCore['settings'];
  requests?: OSCore['requests'];
  props?: RecordType;
};

export type RenderFieldMethodOptions = Omit<
  RenderFieldOptions,
  'mode' | 'type' | 'fieldSettings' | 'requests'
> & {
  types?: Record<string, (options: RenderFieldOptions) => ReactNode>;
  autoFetchSelectOptions?: boolean;
  formRef?: React.RefObject<FormInstance>;
  cellMeta?: OSTableCellMeta;
  /** 是否 field 直接被 FormItem 包裹 */
  isWrapFormItem?: boolean;
  /** 所在 form 类型 */
  wrapFormType?: 'table-form' | 'form';
};

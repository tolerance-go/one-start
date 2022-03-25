import type { FormInstance } from '@ty/antd';
import invariant from 'invariant';
import type { ReactNode } from 'react';
import React from 'react';
import type {
  OSChainSelectFieldAPI,
  OSChainSelectFieldValueType,
  OSCore,
  OSCustomFieldValueType,
  OSDateFieldAPI,
  OSDateRangeFieldAPI,
  OSDateRangeFieldValueType,
  OSDigitFieldAPI,
  OSFormFieldItems,
  OSImageFieldAPI,
  OSImageFieldValueType,
  OSMoneyFieldAPI,
  OSMoneyFieldValueType,
  OSOptionFieldAPI,
  OSPercentFieldAPI,
  OSPlaceholderInputFieldAPI,
  OSPlaceholderInputFieldValueType,
  OSRadioFieldAPI,
  OSRadioFieldValueType,
  OSRelativeDayFieldAPI,
  OSRelativeDayFieldType,
  OSSelectFieldAPI,
  OSSelectFieldValueType,
  OSSwitchFieldAPI,
  OSSwitchFieldValueType,
  OSTableCellMeta,
  OSTextareaFieldAPI,
  OSTextareaFieldValueType,
  OSTextFieldAPI,
  OSTextFieldValueType,
  OSTimeLagFieldAPI,
  OSTransferFieldAPI,
  OSTransferFieldValueType,
  OSTreeSelectFieldAPI,
  OSTreeSelectFieldValueType,
  OSUploadFieldAPI,
  OSUploadFieldValueType,
  RenderFieldOptions,
} from '../../typings';
import OSActionsField from '../fields/actions';
import OSChainSelectField from '../fields/chain-select';
import OSCustomField from '../fields/custom';
import OSDateField from '../fields/date';
import OSDateRangeField from '../fields/date-range';
import OSDigitField from '../fields/digit';
import OSImageField from '../fields/image';
import OSMoneyField from '../fields/money';
import OSOptionField from '../fields/option';
import OSPercentField from '../fields/percent';
import OSPlaceholderInputField from '../fields/placeholder-input';
import OSRadioField from '../fields/radio';
import OSRelativeDayField from '../fields/relative-day';
import OSSelectField from '../fields/select';
import OSSwitchField from '../fields/switch';
import OSTextField from '../fields/text';
import OSTextareaField from '../fields/textarea';
import OSTimeLagField from '../fields/time-lag';
import OSTransferField from '../fields/transfer';
import OSTreeSelectField from '../fields/tree-select';
import OSUploadField from '../fields/upload';

export const renderField = (
  mode: 'edit' | 'read' | 'update',
  type: OSFormFieldItems[number]['type'],
  fieldSettings: OSCore['settings'],
  requests?: OSCore['requests'],
  options?: Omit<RenderFieldOptions, 'mode' | 'type' | 'fieldSettings' | 'requests'> & {
    types?: Record<string, (options: RenderFieldOptions) => ReactNode>;
    autoFetchSelectOptions?: boolean;
    formRef?: React.RefObject<FormInstance>;
    cellMeta?: OSTableCellMeta;
    /** 是否 field 直接被 FormItem 包裹 */
    isWrapFormItem?: boolean;
  },
) => {
  if (type === 'digit') {
    return (
      <OSDigitField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        ref={options?.ref as React.RefObject<OSDigitFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value}
        text={options?.text}
        requests={requests}
      />
    );
  }
  if (type === 'money') {
    return (
      <OSMoneyField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        ref={options?.ref as React.RefObject<OSMoneyFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSMoneyFieldValueType}
        text={options?.text as OSMoneyFieldValueType}
        requests={requests}
      />
    );
  }
  if (type === 'percent') {
    return (
      <OSPercentField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        ref={options?.ref as React.RefObject<OSPercentFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value}
        text={options?.text}
        requests={requests}
      />
    );
  }
  if (type === 'select') {
    return (
      <OSSelectField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        ref={options?.ref as React.RefObject<OSSelectFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSSelectFieldValueType}
        text={options?.text as OSSelectFieldValueType}
        requests={requests}
        autoFetchSelectOptionsWhenMounted={options?.autoFetchSelectOptions}
        requestExtra={() => ({
          form: options?.formRef?.current,
          ...options?.cellMeta,
        })}
      />
    );
  }
  if (type === 'chain-select') {
    return (
      <OSChainSelectField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        ref={options?.ref as React.RefObject<OSChainSelectFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSChainSelectFieldValueType}
        text={options?.text as OSChainSelectFieldValueType}
        requests={requests}
        autoFetchSelectOptionsWhenMounted={options?.autoFetchSelectOptions}
      />
    );
  }

  if (type === 'switch') {
    return (
      <OSSwitchField
        {...options?.props}
        onChangeHook={options?.onChangeHook as (value?: OSSwitchFieldValueType) => void}
        ref={options?.ref as React.RefObject<OSSwitchFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSSwitchFieldValueType}
        text={options?.text as OSSwitchFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'option') {
    return (
      <OSOptionField
        {...options?.props}
        ref={options?.ref as React.RefObject<OSOptionFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value}
        text={options?.text}
        requests={requests}
      />
    );
  }

  if (type === 'text') {
    return (
      <OSTextField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        ref={options?.ref as React.RefObject<OSTextFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSTextFieldValueType}
        text={options?.text as OSTextFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <OSTextareaField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        ref={options?.ref as React.RefObject<OSTextareaFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSTextareaFieldValueType}
        text={options?.text as OSTextareaFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'date') {
    return (
      <OSDateField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        ref={options?.ref as React.RefObject<OSDateFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value}
        text={options?.text}
        requests={requests}
      />
    );
  }

  if (type === 'date-range') {
    return (
      <OSDateRangeField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        ref={options?.ref as React.RefObject<OSDateRangeFieldAPI>}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSDateRangeFieldValueType}
        text={options?.text as OSDateRangeFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'actions') {
    return (
      <OSActionsField
        {...options?.props}
        mode={mode}
        settings={fieldSettings}
        requests={requests}
      />
    );
  }

  if (type === 'custom') {
    return (
      <OSCustomField
        {...options?.props}
        onChangeHook={options?.onChangeHook}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSCustomFieldValueType}
        text={options?.text as OSCustomFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'image') {
    return (
      <OSImageField
        {...options?.props}
        ref={options?.ref as React.RefObject<OSImageFieldAPI>}
        onChangeHook={options?.onChangeHook as any}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSImageFieldValueType}
        text={options?.text as OSImageFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'relative-day') {
    return (
      <OSRelativeDayField
        {...options?.props}
        ref={options?.ref as React.RefObject<OSRelativeDayFieldAPI>}
        onChangeHook={options?.onChangeHook as any}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSRelativeDayFieldType}
        text={options?.text as OSRelativeDayFieldType}
        requests={requests}
      />
    );
  }

  if (type === 'radio') {
    return (
      <OSRadioField
        {...options?.props}
        ref={options?.ref as React.RefObject<OSRadioFieldAPI>}
        onChangeHook={options?.onChangeHook as any}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSRadioFieldValueType}
        text={options?.text as OSRadioFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'time-lag') {
    return (
      <OSTimeLagField
        ref={options?.ref as React.RefObject<OSTimeLagFieldAPI>}
        settings={fieldSettings}
        value={options?.value as OSRadioFieldValueType}
        text={options?.text as OSRadioFieldValueType}
      />
    );
  }

  if (type === 'transfer') {
    return (
      <OSTransferField
        ref={options?.ref as React.RefObject<OSTransferFieldAPI>}
        onChangeHook={options?.onChangeHook as any}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSTransferFieldValueType}
        text={options?.text as OSTransferFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'tree-select') {
    return (
      <OSTreeSelectField
        ref={options?.ref as React.RefObject<OSTreeSelectFieldAPI>}
        onChangeHook={options?.onChangeHook as any}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSTreeSelectFieldValueType}
        text={options?.text as OSTreeSelectFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'placeholder-input') {
    return (
      <OSPlaceholderInputField
        ref={options?.ref as React.RefObject<OSPlaceholderInputFieldAPI>}
        onChangeHook={options?.onChangeHook as any}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSPlaceholderInputFieldValueType}
        text={options?.text as OSPlaceholderInputFieldValueType}
        requests={requests}
      />
    );
  }

  if (type === 'upload') {
    return (
      <OSUploadField
        ref={options?.ref as React.RefObject<OSUploadFieldAPI>}
        onChangeHook={options?.onChangeHook as any}
        mode={mode}
        settings={fieldSettings}
        value={options?.value as OSUploadFieldValueType}
        text={options?.text as OSUploadFieldValueType}
        requests={requests}
      />
    );
  }

  if (type && options?.types) {
    const { types: valueTypes, ...rest } = options;
    invariant(typeof options.types[type] === 'function', '额外类型没有注册');
    return options.types[type]({
      ...rest,
      mode,
      type,
      fieldSettings,
      requests,
      props: options?.props,
    });
  }

  return null;
};

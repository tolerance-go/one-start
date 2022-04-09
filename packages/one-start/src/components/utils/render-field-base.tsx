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
  OSImageFieldChangeEvent,
  OSImageFieldValueType,
  OSMoneyFieldAPI,
  OSMoneyFieldValueType,
  OSOptionFieldAPI,
  OSPercentFieldAPI,
  OSPlaceholderInputFieldAPI,
  OSPlaceholderInputFieldValueType,
  OSRadioFieldAPI,
  OSRadioFieldChangeEvent,
  OSRadioFieldValueType,
  OSRelativeDayFieldAPI,
  OSRelativeDayFieldType,
  OSSelectFieldAPI,
  OSSelectFieldValueType,
  OSSwitchFieldAPI,
  OSSwitchFieldValueType,
  OSTableCellMeta,
  OSTextareaChangeEvent,
  OSTextareaFieldAPI,
  OSTextareaFieldValueType,
  OSTextFieldAPI,
  OSTextFieldChangeEvent,
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

export const renderFieldBase = (
  mode: 'edit' | 'read' | 'update',
  type: OSFormFieldItems[number]['type'],
  settings: OSCore['settings'],
  requests?: OSCore['requests'],
  options?: Omit<RenderFieldOptions, 'mode' | 'type' | 'fieldSettings' | 'requests'> & {
    types?: Record<string, (options: RenderFieldOptions) => ReactNode>;
    autoFetchSelectOptions?: boolean;
    formRef?: React.RefObject<FormInstance>;
    cellMeta?: OSTableCellMeta;
    /** 是否 field 直接被 FormItem 包裹 */
    isWrapFormItem?: boolean;
    /** 所在 form 类型 */
    wrapFormType?: 'table-form' | 'form';
  },
) => {
  if (type === 'digit') {
    return (
      <OSDigitField
        {...options?.props}
        onChange={options?.onChange}
        onValueChange={options?.onValueChange}
        ref={options?.ref as React.RefObject<OSDigitFieldAPI>}
        mode={mode}
        requests={requests}
        settings={settings}
        value={options?.value}
        text={options?.text}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }
  if (type === 'money') {
    return (
      <OSMoneyField
        {...options?.props}
        onChange={options?.onChange as (value?: OSMoneyFieldValueType) => void}
        onValueChange={options?.onValueChange as (value?: OSMoneyFieldValueType) => void}
        ref={options?.ref as React.RefObject<OSMoneyFieldAPI>}
        mode={mode}
        settings={settings}
        value={options?.value as OSMoneyFieldValueType}
        text={options?.text as OSMoneyFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }
  if (type === 'percent') {
    return (
      <OSPercentField
        {...options?.props}
        onChange={options?.onChange}
        onValueChange={options?.onValueChange}
        ref={options?.ref as React.RefObject<OSPercentFieldAPI>}
        mode={mode}
        settings={settings}
        value={options?.value}
        text={options?.text}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }
  if (type === 'select') {
    return (
      <OSSelectField
        {...options?.props}
        onChange={options?.onChange}
        onValueChange={options?.onValueChange}
        ref={options?.ref as React.RefObject<OSSelectFieldAPI>}
        mode={mode}
        settings={settings}
        value={options?.value as OSSelectFieldValueType}
        text={options?.text as OSSelectFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
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
        onChange={options?.onChange}
        onValueChange={options?.onValueChange}
        ref={options?.ref as React.RefObject<OSChainSelectFieldAPI>}
        mode={mode}
        settings={settings}
        value={options?.value as OSChainSelectFieldValueType}
        text={options?.text as OSChainSelectFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
        autoFetchSelectOptionsWhenMounted={options?.autoFetchSelectOptions}
      />
    );
  }

  if (type === 'switch') {
    return (
      <OSSwitchField
        {...options?.props}
        onChange={options?.onChange}
        onValueChange={options?.onValueChange as (value?: OSSwitchFieldValueType) => void}
        ref={options?.ref as React.RefObject<OSSwitchFieldAPI>}
        mode={mode}
        settings={settings}
        value={options?.value as OSSwitchFieldValueType}
        text={options?.text as OSSwitchFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'option') {
    return (
      <OSOptionField
        {...options?.props}
        onChange={options?.onChange}
        ref={options?.ref as React.RefObject<OSOptionFieldAPI>}
        mode={mode}
        settings={settings}
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
        onChange={options?.onChange as (value?: OSTextFieldChangeEvent) => void}
        onValueChange={options?.onValueChange}
        ref={options?.ref as React.RefObject<OSTextFieldAPI>}
        mode={mode}
        settings={settings}
        value={options?.value as OSTextFieldValueType}
        text={options?.text as OSTextFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <OSTextareaField
        {...options?.props}
        onChange={options?.onChange as (value?: OSTextareaChangeEvent) => void}
        onValueChange={options?.onValueChange}
        ref={options?.ref as React.RefObject<OSTextareaFieldAPI>}
        mode={mode}
        settings={settings}
        value={options?.value as OSTextareaFieldValueType}
        text={options?.text as OSTextareaFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'date') {
    return (
      <OSDateField
        {...options?.props}
        onChange={options?.onChange}
        onValueChange={options?.onValueChange}
        ref={options?.ref as React.RefObject<OSDateFieldAPI>}
        mode={mode}
        settings={settings}
        value={options?.value}
        text={options?.text}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'date-range') {
    return (
      <OSDateRangeField
        {...options?.props}
        onChange={options?.onChange}
        onValueChange={options?.onValueChange}
        ref={options?.ref as React.RefObject<OSDateRangeFieldAPI>}
        mode={mode}
        settings={settings}
        value={options?.value as OSDateRangeFieldValueType}
        text={options?.text as OSDateRangeFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'actions') {
    return (
      <OSActionsField
        {...options?.props}
        onChange={options?.onChange}
        mode={mode}
        settings={settings}
        requests={requests}
      />
    );
  }

  if (type === 'custom') {
    return (
      <OSCustomField
        {...options?.props}
        onChange={options?.onChange}
        onValueChange={options?.onValueChange}
        mode={mode}
        settings={settings}
        value={options?.value as OSCustomFieldValueType}
        text={options?.text as OSCustomFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'image') {
    return (
      <OSImageField
        {...options?.props}
        onChange={options?.onChange as (value?: OSImageFieldChangeEvent) => void}
        ref={options?.ref as React.RefObject<OSImageFieldAPI>}
        onValueChange={options?.onValueChange as any}
        mode={mode}
        settings={settings}
        value={options?.value as OSImageFieldValueType}
        text={options?.text as OSImageFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'relative-day') {
    return (
      <OSRelativeDayField
        {...options?.props}
        onChange={options?.onChange}
        ref={options?.ref as React.RefObject<OSRelativeDayFieldAPI>}
        onValueChange={options?.onValueChange as any}
        mode={mode}
        settings={settings}
        value={options?.value as OSRelativeDayFieldType}
        text={options?.text as OSRelativeDayFieldType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'radio') {
    return (
      <OSRadioField
        {...options?.props}
        onChange={options?.onChange as (value?: OSRadioFieldChangeEvent) => void}
        ref={options?.ref as React.RefObject<OSRadioFieldAPI>}
        onValueChange={options?.onValueChange as any}
        mode={mode}
        settings={settings}
        value={options?.value as OSRadioFieldValueType}
        text={options?.text as OSRadioFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'time-lag') {
    return (
      <OSTimeLagField
        ref={options?.ref as React.RefObject<OSTimeLagFieldAPI>}
        onChange={options?.onChange}
        onValueChange={options?.onValueChange as any}
        settings={settings}
        value={options?.value as OSRadioFieldValueType}
        text={options?.text as OSRadioFieldValueType}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
        requests={requests}
      />
    );
  }

  if (type === 'transfer') {
    return (
      <OSTransferField
        ref={options?.ref as React.RefObject<OSTransferFieldAPI>}
        onValueChange={options?.onValueChange as any}
        mode={mode}
        settings={settings}
        value={options?.value as OSTransferFieldValueType}
        text={options?.text as OSTransferFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'tree-select') {
    return (
      <OSTreeSelectField
        ref={options?.ref as React.RefObject<OSTreeSelectFieldAPI>}
        onValueChange={options?.onValueChange as any}
        mode={mode}
        settings={settings}
        value={options?.value as OSTreeSelectFieldValueType}
        text={options?.text as OSTreeSelectFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
        requestExtra={() => ({
          form: options?.formRef?.current,
        })}
      />
    );
  }

  if (type === 'placeholder-input') {
    return (
      <OSPlaceholderInputField
        ref={options?.ref as React.RefObject<OSPlaceholderInputFieldAPI>}
        onValueChange={options?.onValueChange as any}
        mode={mode}
        settings={settings}
        value={options?.value as OSPlaceholderInputFieldValueType}
        text={options?.text as OSPlaceholderInputFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
      />
    );
  }

  if (type === 'upload') {
    return (
      <OSUploadField
        ref={options?.ref as React.RefObject<OSUploadFieldAPI>}
        onValueChange={options?.onValueChange as any}
        mode={mode}
        settings={settings}
        value={options?.value as OSUploadFieldValueType}
        text={options?.text as OSUploadFieldValueType}
        requests={requests}
        isWrapFormItem={options?.isWrapFormItem}
        wrapFormType={options?.wrapFormType}
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
      fieldSettings: settings,
      requests,
      props: options?.props,
    });
  }

  return null;
};

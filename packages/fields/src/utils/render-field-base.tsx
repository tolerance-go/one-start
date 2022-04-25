import invariant from 'invariant';
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
  RenderFieldMethodOptions,
} from '@ty-one-start/typings';
import OSActionsField from '../components/actions';
import OSChainSelectField from '../components/chain-select';
import OSCustomField from '../components/custom';
import OSDateField from '../components/date';
import OSDateRangeField from '../components/date-range';
import OSDigitField from '../components/digit';
import OSImageField from '../components/image';
import OSMoneyField from '../components/money';
import OSOptionField from '../components/option';
import OSPercentField from '../components/percent';
import OSPlaceholderInputField from '../components/placeholder-input';
import OSRadioField from '../components/radio';
import OSRelativeDayField from '../components/relative-day';
import OSSelectField from '../components/select';
import OSSwitchField from '../components/switch';
import OSTextField from '../components/text';
import OSTextareaField from '../components/textarea';
import OSTimeLagField from '../components/time-lag';
import OSTransferField from '../components/transfer';
import OSTreeSelectField from '../components/tree-select';
import OSUploadField from '../components/upload';

export const renderFieldBase = (
  mode: 'edit' | 'read' | 'update',
  type: OSFormFieldItems[number]['type'],
  settings: OSCore['settings'],
  requests?: OSCore['requests'],
  options?: RenderFieldMethodOptions,
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

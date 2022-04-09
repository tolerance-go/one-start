import type { FormInstance } from '@ty/antd';
import type { ReactNode } from 'react';
import React from 'react';
import type { OSCore, OSFormFieldItems, OSTableCellMeta, RenderFieldOptions } from '../../typings';
import OSAtomField from '../fields/atom';
import { renderFieldBase } from './render-field-base';

export const renderField = (
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
  if (type === 'atom') {
    const { props, ...rest } = options ?? {};
    return <OSAtomField {...props} {...rest} mode={mode} settings={settings} requests={requests} />;
  }

  return renderFieldBase(mode, type, settings, requests, options);
};

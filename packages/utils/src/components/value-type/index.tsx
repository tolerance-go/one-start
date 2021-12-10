import type { ProRenderFieldPropsType } from '@ty-ant-design/pro-provider';
import React from 'react';
import { FieldPercentRaw } from './percent-raw';
import { SearchableSelect } from './searchable-select';

export const customValueType: Record<string, ProRenderFieldPropsType> = {
  'searchable-select': {
    render: (text) => text,
    renderFormItem: (text, formItemProps) => {
      return <SearchableSelect {...formItemProps} {...formItemProps.fieldProps} />;
    },
  },
  'percent-raw': {
    render: (text, fieldProps) => {
      return <FieldPercentRaw {...fieldProps} text={text} mode="read" />;
    },
    renderFormItem: (text, formItemProps) => {
      return <FieldPercentRaw {...formItemProps} {...formItemProps.fieldProps} />;
    },
  },
};

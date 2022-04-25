import { renderFieldBase } from './render-field-base';
import OSAtomField from '../components/atom';
import type { OSCore, OSFormFieldItems, RenderFieldMethodOptions } from '@ty-one-start/typings';
import React from 'react';

export const renderField = (
  mode: 'edit' | 'read' | 'update',
  type: OSFormFieldItems[number]['type'],
  settings: OSCore['settings'],
  requests?: OSCore['requests'],
  options?: RenderFieldMethodOptions,
) => {
  if (type === 'atom') {
    return <OSAtomField options={options} mode={mode} settings={settings} requests={requests} />;
  }

  return renderFieldBase(mode, type, settings, requests, options);
};

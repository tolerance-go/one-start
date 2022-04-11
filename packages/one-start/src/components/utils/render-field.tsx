import React from 'react';
import type { OSCore, OSFormFieldItems, RenderFieldMethodOptions } from '../../typings';
import OSAtomField from '../fields/atom';
import { renderFieldBase } from './render-field-base';

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

import type EventEmitter from 'eventemitter3';
import React from 'react';

export const LayoutModalFormEventBusContext = React.createContext<EventEmitter | null>(null);
export const LayoutTabsFormEventBusContext = React.createContext<EventEmitter | null>(null);

export const LayoutTabsFormTabMetaContext = React.createContext<{
  formKey: string;
}>({ formKey: '' });

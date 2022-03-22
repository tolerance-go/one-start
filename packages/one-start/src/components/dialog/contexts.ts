import React from 'react';
import type { OSDialogAPI, OSDialogType } from '../../typings';

export const OSDialogAPIContext = React.createContext<React.RefObject<OSDialogAPI>>(
  React.createRef(),
);

export const OSDialogTypeContext = React.createContext<OSDialogType['type'] | null>(null);

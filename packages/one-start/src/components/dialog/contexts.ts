import React from 'react';
import { OSDialogAPI } from '../typings';

export const OSDialogAPIContext = React.createContext<React.RefObject<OSDialogAPI>>(
  React.createRef(),
);

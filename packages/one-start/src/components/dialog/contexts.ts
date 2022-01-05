import React from 'react';
import type { OSDialogAPI } from '../../typings';

export const OSDialogAPIContext = React.createContext<React.RefObject<OSDialogAPI>>(
  React.createRef(),
);

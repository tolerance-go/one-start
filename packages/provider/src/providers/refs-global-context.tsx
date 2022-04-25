import type { OSReferencesCollectorType } from './references';
import React from 'react';

export const globalRefKeys = {
  dialogs: {
    messages: {
      globalMessage: 'globalMessage',
    },
  },
};

export const OSReferencesGlobalContext = React.createContext<
  React.RefObject<OSReferencesCollectorType<typeof globalRefKeys>>
>(React.createRef());

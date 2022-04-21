import React from 'react';
import type { OSLayoutFormAPI } from '@ty-one-start/typings';

export const OSLayoutFormAPIContext = React.createContext<React.RefObject<OSLayoutFormAPI>>(
  React.createRef(),
);

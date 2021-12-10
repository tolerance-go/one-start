import React from 'react';
import type { OSLayoutFormAPI } from '../typings';

export const OSLayoutFormAPIContext = React.createContext<React.RefObject<OSLayoutFormAPI>>(
  React.createRef(),
);

import React from 'react';
import type { OSTableAPI } from '@ty-one-start/typings';

export const TableAPIContext = React.createContext<React.RefObject<OSTableAPI>>(React.createRef());

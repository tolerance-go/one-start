import React from 'react';
import type { OSTableAPI } from '../../typings';

export const TableAPIContext = React.createContext<React.RefObject<OSTableAPI>>(React.createRef());

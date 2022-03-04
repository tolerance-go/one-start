/** 高优先组件尺寸 */
import React from 'react';
import type { PrioritizedComponentSizeContextValue } from '../../typings/provider';

export const PrioritizedComponentSizeContext =
  React.createContext<PrioritizedComponentSizeContextValue>({});

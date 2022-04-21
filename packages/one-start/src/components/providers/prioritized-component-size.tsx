/** 高优先组件尺寸 */
import React from 'react';
import type { PrioritizedComponentSizeContextValue } from '@ty-one-start/typings/provider';

export const PrioritizedComponentSizeContext =
  React.createContext<PrioritizedComponentSizeContextValue>({});

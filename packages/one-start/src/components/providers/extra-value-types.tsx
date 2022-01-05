import type { ReactNode } from 'react';
import React from 'react';
import type { RenderFieldOptions } from '../../typings';

export const ExtraValueTypesContext = React.createContext<
  Record<string, (options: RenderFieldOptions) => ReactNode>
>({});

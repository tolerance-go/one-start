import React, { ReactNode } from 'react';
import { RenderFieldOptions } from '../typings';

export const ExtraValueTypesContext = React.createContext<
  Record<string, (options: RenderFieldOptions) => ReactNode>
>({});

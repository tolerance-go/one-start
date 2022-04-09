import type { ReactNode } from 'react';
import React from 'react';
import type { OSFieldValueType, RenderFieldOptions } from '../../typings';

export const ExtraValueTypesContext = React.createContext<
  Record<
    string,
    <ExtraFieldValueType = OSFieldValueType>(
      options: RenderFieldOptions<ExtraFieldValueType>,
    ) => ReactNode
  >
>({});

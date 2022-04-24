import React from 'react';

export const TableWrapperContext = React.createContext<React.RefObject<HTMLDivElement>>(
  React.createRef(),
);

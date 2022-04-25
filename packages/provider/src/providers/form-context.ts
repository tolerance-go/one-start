import type { FormInstance } from 'antd';
import React from 'react';

export const FormInstanceContext = React.createContext<React.RefObject<FormInstance>>(
  React.createRef(),
);

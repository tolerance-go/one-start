import type { FormInstance } from '@ty/antd';
import type { NamePath } from '@ty/antd/lib/form/interface';
import React from 'react';

const ProFormContext = React.createContext<{
  getFieldsFormatValue?: (nameList?: NamePath[] | true) => any;
  getFieldFormatValue?: (nameList?: NamePath) => any;
  formRef?: React.MutableRefObject<FormInstance<any>>;
}>({});

export default ProFormContext;

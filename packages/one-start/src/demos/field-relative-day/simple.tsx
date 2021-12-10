import { OSRelativeDayField, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string | number>();
  return (
    <OSProviderWrapper>
      <div>value: {JSON.stringify(value)}</div>
      <OSRelativeDayField value={value} onChange={setValue} mode="edit"></OSRelativeDayField>
    </OSProviderWrapper>
  );
};

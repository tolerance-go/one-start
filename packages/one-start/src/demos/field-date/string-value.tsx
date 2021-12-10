import { OSDateField, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState('2021-10-10');

  return (
    <OSProviderWrapper>
      <OSDateField value={value} onChange={setValue} mode="edit"></OSDateField>
    </OSProviderWrapper>
  );
};

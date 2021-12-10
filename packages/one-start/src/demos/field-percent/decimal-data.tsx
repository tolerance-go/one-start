import { OSPercentField, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string | number>();
  return (
    <OSProviderWrapper>
      <OSPercentField value={value} onChange={setValue} mode="edit"></OSPercentField>
      <OSPercentField
        value={value}
        onChange={setValue}
        mode="edit"
        settings={{
          decimalData: false,
        }}
      ></OSPercentField>
    </OSProviderWrapper>
  );
};

import { OSProviderWrapper, OSTextareaField } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string>();

  return (
    <OSProviderWrapper>
      <OSTextareaField
        value={value}
        onChange={(e) => setValue(e?.target.value)}
        mode="edit"
        settings={{
          maxLength: 10,
          showCount: true,
        }}
      ></OSTextareaField>
    </OSProviderWrapper>
  );
};

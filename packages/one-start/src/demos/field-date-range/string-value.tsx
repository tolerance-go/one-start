import type { OSDateRangeFieldValueType } from '@ty-one-start/one-start';
import { OSDateRangeField, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSDateRangeFieldValueType>(['2021-10-1', '2021-10-10']);

  return (
    <OSProviderWrapper>
      <OSDateRangeField value={value} onChange={setValue} mode="edit"></OSDateRangeField>
    </OSProviderWrapper>
  );
};

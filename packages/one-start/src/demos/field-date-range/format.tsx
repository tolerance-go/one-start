import type { OSDateRangeFieldValueType } from '@ty-one-start/one-start';
import { OSDateRangeField, OSProviderWrapper } from '@ty-one-start/one-start';
import moment from 'moment';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSDateRangeFieldValueType>([moment(), moment().add(7, 'd')]);

  return (
    <OSProviderWrapper>
      <OSDateRangeField
        value={value}
        onChange={setValue}
        mode="edit"
        settings={{
          format: 'MMMM Do YYYY, h:mm:ss a',
        }}
      ></OSDateRangeField>
    </OSProviderWrapper>
  );
};

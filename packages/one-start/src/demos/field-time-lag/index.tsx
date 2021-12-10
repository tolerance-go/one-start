import { OSTimeLagField, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<number[]>();

  return (
    <OSProviderWrapper>
      <OSTimeLagField
        value={value}
        onChange={setValue}
        mode="edit"
        settings={{ addonBefore: 'T+', addonAfter: '时间差' }}
      ></OSTimeLagField>
    </OSProviderWrapper>
  );
};

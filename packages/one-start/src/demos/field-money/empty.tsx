import { OSMoneyField, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSMoneyField value={undefined} mode="read"></OSMoneyField>
    </OSProviderWrapper>
  );
};

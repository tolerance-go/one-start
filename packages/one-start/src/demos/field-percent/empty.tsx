import { OSPercentField, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSPercentField text={undefined} mode="read"></OSPercentField>
    </OSProviderWrapper>
  );
};

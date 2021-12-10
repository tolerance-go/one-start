import { OSDigitField, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSDigitField text={undefined} mode="read"></OSDigitField>
    </OSProviderWrapper>
  );
};

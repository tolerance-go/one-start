import { OSProviderWrapper, OSTextareaField } from '@ty-one-start/one-start';
import { mock, Random } from 'mockjs';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSTextareaField
        value={
          mock({
            text: () => Random.paragraph(),
          }).text
        }
        mode="read"
      ></OSTextareaField>
    </OSProviderWrapper>
  );
};

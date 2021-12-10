import { OSImageField, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSImageField
        value={'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
        mode="read"
        settings={{
          width: 400,
        }}
      ></OSImageField>
    </OSProviderWrapper>
  );
};

/**
 * desc: 当 fieldItems 为空的时候显示空占位符，hideEmpty 默认为 true
 */
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          hideEmpty: false,
          fieldItems: [],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

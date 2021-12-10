import { OSActionsField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Button } from '@ty/antd';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSActionsField
        settings={{
          actions: [
            <Button type="link">btn1</Button>,
            <Button type="link">btn2</Button>,
            <Button type="link">btn3</Button>,
          ],
        }}
      ></OSActionsField>
    </OSProviderWrapper>
  );
};

import { OSActionsField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Button } from '@ty/antd';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSActionsField
        settings={{
          splitMarker: '#',
          actions: [<Button>btn1</Button>, <Button>btn2</Button>, <Button>btn3</Button>],
        }}
      ></OSActionsField>
    </OSProviderWrapper>
  );
};

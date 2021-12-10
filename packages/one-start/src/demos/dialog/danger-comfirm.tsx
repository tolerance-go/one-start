import { OSDialog, OSDialogAPI, OSProviderWrapper } from '@ty-one-start/one-start';
import { Button, Space } from '@ty/antd';
import React, { useRef } from 'react';
import delay from 'delay';

export default () => {
  const dialogRef1 = useRef<OSDialogAPI>(null);

  return (
    <OSProviderWrapper>
      <Space>
        <OSDialog
          ref={dialogRef1}
          type="modal-operation"
          settings={{
            danger: true,
            title: '确认标题',
            content: <div style={{ background: '#ccc', height: 100 }}></div>,
          }}
          requests={{
            requestAfterConfirm: async () => {
              await delay(1000);
            },
          }}
        >
          <Button onClick={() => dialogRef1.current?.push()}>触发确认</Button>
        </OSDialog>
      </Space>
    </OSProviderWrapper>
  );
};

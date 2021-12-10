import { OSDialog, OSDialogModalOperationAPI, OSProviderWrapper } from '@ty-one-start/one-start';
import { Button, Space } from '@ty/antd';
import delay from 'delay';
import React, { useRef, useState } from 'react';

export default () => {
  const dialogRef = useRef<OSDialogModalOperationAPI>(null);
  const [loading, setLoading] = useState(false);
  const dialogRef2 = useRef<OSDialogModalOperationAPI>(null);
  const [loading2, setLoading2] = useState(false);

  return (
    <OSProviderWrapper>
      <Space>
        <OSDialog
          type="popconfirm"
          ref={dialogRef2}
          settings={{
            title: '确认标题',
          }}
          requests={{
            requestAfterCancel: async () => {
              await delay(1000);
              return {
                error: false,
              };
            },
            requestAfterConfirm: async () => {
              await delay(1000);
              return {
                error: false,
              };
            },
          }}
        >
          <Button
            loading={loading2}
            onClick={async () => {
              setLoading2(true);
              await dialogRef2.current?.push();
              setLoading2(false);
            }}
          >
            确认弹出反馈
          </Button>
        </OSDialog>
        <OSDialog
          ref={dialogRef}
          type="modal-operation"
          settings={{
            title: '确认标题',
            content: <div style={{ background: '#ccc' }}>content</div>,
          }}
          requests={{
            requestAfterCancel: async () => {
              await delay(1000);
              return {
                error: false,
              };
            },
            requestAfterConfirm: async () => {
              await delay(1000);
              return {
                error: false,
              };
            },
          }}
        >
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true);
              await dialogRef.current?.push();
              setLoading(false);
            }}
          >
            确认弹窗反馈
          </Button>
        </OSDialog>
      </Space>
    </OSProviderWrapper>
  );
};

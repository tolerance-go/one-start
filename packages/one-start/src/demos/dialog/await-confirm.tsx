import type { OSDialogModalOperationAPI } from '@ty-one-start/one-start';
import { OSDialog, OSProviderWrapper } from '@ty-one-start/one-start';
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
              const results = await dialogRef2.current?.push();
              alert(JSON.stringify(results));
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
              const results = await dialogRef.current?.push();
              alert(JSON.stringify(results));
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

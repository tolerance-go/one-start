import type { OSDialogAPI } from '@ty-one-start/one-start';
import { OSDialog, OSProviderWrapper } from '@ty-one-start/one-start';
import { Button, Space } from '@ty/antd';
import delay from 'delay';
import React, { useRef, useState } from 'react';

export default () => {
  const dialogRef = useRef<OSDialogAPI>(null);
  const dialogRef2 = useRef<OSDialogAPI>(null);
  const dialogRef3 = useRef<OSDialogAPI>(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  return (
    <OSProviderWrapper>
      <Space>
        <OSDialog
          ref={dialogRef2}
          type="popover"
          settings={{
            title: '确认提示',
            content: <div style={{ background: '#ccc' }}>body</div>,
          }}
          requests={{
            requestBeforeClose: async () => {
              await delay(2000);
              alert('同步数据成功');
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
            弹出反馈
          </Button>
        </OSDialog>
        <OSDialog
          ref={dialogRef}
          type="modal"
          requests={{
            requestBeforeClose: async () => {
              await delay(2000);
              alert('同步数据成功');
              return {
                error: false,
              };
            },
          }}
          settings={{
            title: '确认提示',
            body: <div style={{ background: '#ccc' }}>body</div>,
            footer: <div style={{ background: '#ccc' }}>footer</div>,
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
            弹窗反馈
          </Button>
        </OSDialog>

        <OSDialog
          ref={dialogRef3}
          type="drawer"
          requests={{
            requestBeforeClose: async () => {
              await delay(2000);
              alert('同步数据成功');
              return {
                error: false,
              };
            },
          }}
          settings={{
            title: '确认提示',
            body: <div style={{ background: '#ccc' }}>body</div>,
            footer: <div style={{ background: '#ccc' }}>footer</div>,
          }}
        >
          <Button
            loading={loading3}
            onClick={async () => {
              setLoading3(true);
              await dialogRef3.current?.push();
              setLoading3(false);
            }}
          >
            抽屉反馈
          </Button>
        </OSDialog>
      </Space>
    </OSProviderWrapper>
  );
};

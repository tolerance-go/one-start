import { OSDialog, OSDialogAPI, OSProviderWrapper } from '@ty-one-start/one-start';
import { Button, Space } from 'antd';
import React, { useRef } from 'react';

export default () => {
  const dialogRef1 = useRef<OSDialogAPI>(null);
  const dialogRef2 = useRef<OSDialogAPI>(null);
  const dialogRef3 = useRef<OSDialogAPI>(null);
  const dialogRef4 = useRef<OSDialogAPI>(null);
  const dialogRef5 = useRef<OSDialogAPI>(null);
  const dialogRef6 = useRef<OSDialogAPI>(null);

  return (
    <OSProviderWrapper>
      <Space>
        <OSDialog ref={dialogRef1} type="message">
          <Button
            onClick={() =>
              dialogRef1.current?.push({
                title: '消息内容',
              })
            }
          >
            触发消息
          </Button>
        </OSDialog>
        <OSDialog
          ref={dialogRef2}
          type="popconfirm"
          settings={{
            title: '确认气泡框',
          }}
        >
          <Button onClick={() => dialogRef2.current?.push()}>触发确认气泡框</Button>
        </OSDialog>
        <OSDialog
          ref={dialogRef3}
          type="popover"
          settings={{
            title: '气泡框',
          }}
        >
          <Button onClick={() => dialogRef3.current?.push()}>触发气泡框</Button>
        </OSDialog>
        <OSDialog
          ref={dialogRef4}
          type="modal"
          settings={{
            title: '拟态框',
            body: <div style={{ background: '#ccc', height: 30 }}></div>,
          }}
        >
          <Button onClick={() => dialogRef4.current?.push()}>弹出拟态框</Button>
        </OSDialog>
        <OSDialog
          ref={dialogRef5}
          type="modal-operation"
          settings={{
            title: '确认拟态框',
            content: <div style={{ background: '#ccc', height: 30 }}></div>,
          }}
        >
          <Button onClick={() => dialogRef5.current?.push()}>弹出确认拟态框</Button>
        </OSDialog>
        <OSDialog
          ref={dialogRef6}
          type="drawer"
          settings={{
            title: '抽屉拟态框',
            body: <div style={{ background: '#ccc', height: 30 }}></div>,
          }}
        >
          <Button onClick={() => dialogRef6.current?.push()}>弹出抽屉拟态框</Button>
        </OSDialog>
      </Space>
    </OSProviderWrapper>
  );
};

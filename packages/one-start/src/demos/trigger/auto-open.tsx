import { OSDialog, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Space } from 'antd';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSDialog
          type="popconfirm"
          settings={{
            title: '确认气泡框',
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: '触发确认气泡框',
            }}
          ></OSTrigger>
        </OSDialog>
        <OSDialog
          type="popover"
          settings={{
            title: '气泡框',
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: '触发气泡框',
            }}
          ></OSTrigger>
        </OSDialog>
        <OSDialog
          type="modal"
          settings={{
            title: '拟态框',
            body: <div style={{ background: '#ccc', height: 30 }}></div>,
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: '弹出拟态框',
            }}
          ></OSTrigger>
        </OSDialog>
        <OSDialog
          type="modal-operation"
          settings={{
            title: '确认拟态框',
            content: <div style={{ background: '#ccc', height: 30 }}></div>,
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: '弹出确认拟态框',
            }}
          ></OSTrigger>
        </OSDialog>
      </Space>
    </OSProviderWrapper>
  );
};

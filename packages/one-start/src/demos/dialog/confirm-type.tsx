import { OSDialog, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import { Space } from 'antd';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space>
        <OSDialog
          type="modal-operation"
          settings={{
            title: '确认标题',
            content: <div style={{ background: '#ccc', height: 100 }}></div>,
            type: 'confirm',
          }}
          requests={{
            requestAfterConfirm: async () => {
              await delay(1000);
            },
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: 'confirm',
            }}
          ></OSTrigger>
        </OSDialog>
        <OSDialog
          type="modal-operation"
          settings={{
            title: '确认标题',
            content: <div style={{ background: '#ccc', height: 100 }}></div>,
            type: 'info',
          }}
          requests={{
            requestAfterConfirm: async () => {
              await delay(1000);
            },
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: 'info',
            }}
          ></OSTrigger>
        </OSDialog>
        <OSDialog
          type="modal-operation"
          settings={{
            title: '确认标题',
            content: <div style={{ background: '#ccc', height: 100 }}></div>,
            type: 'error',
          }}
          requests={{
            requestAfterConfirm: async () => {
              await delay(1000);
            },
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: 'error',
            }}
          ></OSTrigger>
        </OSDialog>
        <OSDialog
          type="modal-operation"
          settings={{
            title: '确认标题',
            content: <div style={{ background: '#ccc', height: 100 }}></div>,
            type: 'warning',
          }}
          requests={{
            requestAfterConfirm: async () => {
              await delay(1000);
            },
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: 'warning',
            }}
          ></OSTrigger>
        </OSDialog>
        <OSDialog
          type="modal-operation"
          settings={{
            title: '确认标题',
            content: <div style={{ background: '#ccc', height: 100 }}></div>,
            type: 'success',
          }}
          requests={{
            requestAfterConfirm: async () => {
              await delay(1000);
            },
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: 'success',
            }}
          ></OSTrigger>
        </OSDialog>
      </Space>
    </OSProviderWrapper>
  );
};

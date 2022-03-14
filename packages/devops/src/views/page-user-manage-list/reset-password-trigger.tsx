import type { OSActionsCreateAPI, RecordType, OSTableAPI } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSActionsCreate } from '@ty-one-start/one-start';
import React, { useRef } from 'react';
import delay from 'delay';

export default (props: { rowInfo: RecordType; tableAPIRef: React.RefObject<OSTableAPI> }) => {
  const createRef = useRef<OSActionsCreateAPI>(null);

  return (
    <OSProviderWrapper>
      <OSActionsCreate
        ref={createRef}
        settings={{
          createTriggerSettings: {
            type: 'link',
            text: '重置密码',
          },
          createModalDialogSettings: {
            width: 600,
            title: '更改密码',
          },
          createFormSettings: {
            labelCol: {
              span: 6,
            },
            wrapperCol: {
              span: 18,
            },
            fieldItems: [
              {
                type: 'text',
                settings: {
                  title: '密码',
                  dataIndex: 'password',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                },
              },
              {
                type: 'text',
                settings: {
                  title: '确认密码',
                  dataIndex: 'confirmPassword',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                },
              },
            ],
          },
        }}
        requests={{
          requestCreateSource: async () => {
            await delay(1000);
            props.tableAPIRef.current?.reload();
            return false;
          },
        }}
      />
    </OSProviderWrapper>
  );
};

import type { OSActionsCreateAPI, OSTableAPI } from '@ty-one-start/one-start';
import { OSActionsCreate, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';

export default (props: { tableAPIRef: React.RefObject<OSTableAPI> }) => {
  const createRef = useRef<OSActionsCreateAPI>(null);

  return (
    <OSProviderWrapper>
      <OSActionsCreate
        ref={createRef}
        settings={{
          createModalDialogSettings: {
            width: 600,
            title: '当前正在创建新用户',
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
                  title: '用户名',
                  dataIndex: 'username',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                },
              },
              {
                type: 'switch',
                settings: {
                  title: '是否开启证书审批',
                  dataIndex: '是否开启证书审批',
                },
              },
              {
                type: 'select',
                settings: {
                  title: '审批对象',
                  dataIndex: 'approval',
                  mode: 'multiple',
                  showSearch: true,
                },
                requests: {
                  requestOptions: async () => {
                    return {
                      error: false,
                      data: [
                        {
                          label: '审批组1',
                          value: uuid(),
                        },
                        {
                          label: '审批组2',
                          value: uuid(),
                        },
                      ],
                    };
                  },
                },
              },
            ],
          },
        }}
        requests={{
          requestCreateSource: async () => {
            props.tableAPIRef.current?.reload();
            return false;
          },
        }}
      />
    </OSProviderWrapper>
  );
};

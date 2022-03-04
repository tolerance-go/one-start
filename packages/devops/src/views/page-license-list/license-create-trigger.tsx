import type { OSActionsCreateAPI, OSTableAPI } from '@ty-one-start/one-start';
import { OSActionsCreate, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { data } from './constants';

export default (props: { tableAPIRef: React.RefObject<OSTableAPI> }) => {
  const createRef = useRef<OSActionsCreateAPI>(null);

  return (
    <OSProviderWrapper>
      <OSActionsCreate
        ref={createRef}
        settings={{
          createModalDialogSettings: {
            width: 800,
            title: '创建 license 申请',
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
                type: 'switch',
                settings: {
                  title: '是否开启验证码登录',
                  dataIndex: '是否开启验证码登录',
                },
              },
              {
                type: 'tree-select',
                settings: {
                  title: '页面权限',
                  dataIndex: '页面权限',
                  multiple: true,
                  showSearch: true,
                },
                requests: {
                  requestOptions: async () => {
                    return {
                      error: false,
                      data,
                    };
                  },
                },
              },
              {
                type: 'tree-select',
                settings: {
                  title: '功能权限',
                  dataIndex: '功能权限',
                  multiple: true,
                  showSearch: true,
                },
                requests: {
                  requestOptions: async () => {
                    return {
                      error: false,
                      data: [
                        {
                          label: '功能1',
                          value: uuid(),
                          children: [
                            {
                              label: '功能1-1',
                              value: uuid(),
                            },
                          ],
                        },
                        {
                          label: '功能2',
                          value: uuid(),
                          children: [
                            {
                              label: '功能2-1',
                              value: uuid(),
                            },
                            {
                              label: '功能2-2',
                              value: uuid(),
                            },
                          ],
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

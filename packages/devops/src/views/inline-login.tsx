import type { OSDialogAPI } from '@ty-one-start/one-start';
import { OSDialog, OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { useEffect, useRef } from 'react';
import store from 'store2';
import { userIsLogined } from '../utils';

export default () => {
  const dialogRef = useRef<OSDialogAPI>(null);

  useEffect(() => {
    if (!userIsLogined()) {
      dialogRef.current?.push();
    }
  }, []);

  return (
    <>
      <OSProviderWrapper>
        <OSDialog
          ref={dialogRef}
          type="modal-operation"
          settings={{
            title: '请先登录',
            content: (
              <OSForm
                settings={{
                  fieldItems: [
                    {
                      type: 'text',
                      settings: {
                        title: '用户名',
                        dataIndex: 'username',
                      },
                    },
                    {
                      type: 'text',
                      settings: {
                        title: '密码',
                        dataIndex: 'password',
                      },
                    },
                  ],
                }}
              ></OSForm>
            ),
            type: 'confirm',
          }}
          requests={{
            requestAfterConfirm: async () => {
              store.set('one-devops-user-token', 'fake');
              window.location.reload();
            },
          }}
        ></OSDialog>
      </OSProviderWrapper>
    </>
  );
};

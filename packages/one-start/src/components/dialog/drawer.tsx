import { CloseSquareOutlined } from '@ant-design/icons';
import { Drawer } from '@ty/antd';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import type { OSDialogDrawerAPI, OSDialogDrawerType } from '../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useVisible } from './use-visible';
import { renderTrigger } from './utils';

const OSDialogDrawer: React.ForwardRefRenderFunction<
  OSDialogDrawerAPI,
  PropsWithChildren<OSDialogDrawerType>
> = (props, ref) => {
  const { settings, actionsRef: propActionsRef, forceRender, destroyOnClose = true } = props;
  const clsPrefix = useClsPrefix('os-drawer');

  const { footer, body } = settings ?? {};

  const { visible, close, setVisible, initPromise, promiseRef } = useVisible({
    onVisibleChange: props.onVisibleChange,
    initialVisible: props.settings?.initialVisible,
  });

  useImperativeHandle(ref, () => {
    return {
      push: async () => {
        setVisible(true);
        initPromise();
        await promiseRef.current;
      },
      pop: () => {
        close();
      },
      update: () => {},
    };
  });

  useActionsRef(
    {
      setVisible,
    },
    propActionsRef,
  );

  return (
    <>
      <Drawer
        forceRender={forceRender}
        className={clsPrefix}
        width={settings?.width}
        visible={visible}
        onClose={close}
        footer={footer ?? null}
        title={settings?.title}
        destroyOnClose={destroyOnClose}
        closeIcon={<CloseSquareOutlined />}
      >
        {body}
      </Drawer>
      {renderTrigger(props.children)}
    </>
  );
};

export default React.forwardRef(OSDialogDrawer);

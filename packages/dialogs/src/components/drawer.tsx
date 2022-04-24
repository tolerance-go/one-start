import { CloseSquareOutlined } from '@ant-design/icons';
import { Drawer } from '@ty/antd';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle } from 'react';
import { useActionsRef } from '@ty-one-start/utils';
import type { OSDialogDrawerAPI, OSDialogDrawerType } from '@ty-one-start/typings';
import { useClsPrefix } from '@ty-one-start/utils';
import { useVisible } from './use-visible';
import { renderTrigger } from './utils';

const OSDialogDrawer: React.ForwardRefRenderFunction<
  OSDialogDrawerAPI,
  PropsWithChildren<OSDialogDrawerType>
> = (props, ref) => {
  const { settings, actionsRef: propActionsRef, forceRender, destroyOnClose = true } = props;
  const clsPrefix = useClsPrefix('os-drawer');

  const { footer, body, modalMask } = settings ?? {};

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

  const mask = (() => {
    if (modalMask === 'transparent') {
      return true;
    }
    return modalMask;
  })();

  const maskStyle = (() => {
    if (modalMask === 'transparent') {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      };
    }
    return undefined;
  })();

  return (
    <>
      <Drawer
        mask={mask}
        maskStyle={maskStyle}
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

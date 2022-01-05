import { CloseSquareOutlined } from '@ant-design/icons';
import { Affix, Modal } from '@ty/antd';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { useActionsRef } from '../hooks/use-actions-ref';
import type { OSDialogModalAPI, OSDialogModalType } from '../../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useVisible } from './use-visible';
import cls from 'classnames';
import { renderTrigger } from './utils';

const OSDialogModal: React.ForwardRefRenderFunction<
  OSDialogModalAPI,
  PropsWithChildren<OSDialogModalType>
> = (props, ref) => {
  const { settings, actionsRef: propActionsRef, forceRender, destroyOnClose = true } = props;
  const clsPrefix = useClsPrefix('os-modal');

  const { footer, body } = settings ?? {};

  const { visible, close, setVisible, initPromise, promiseRef } = useVisible({
    onVisibleChange: props.onVisibleChange,
    initialVisible: props.settings?.initialVisible,
  });

  const idRef = useRef(uuid());

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
      <Modal
        destroyOnClose={destroyOnClose}
        forceRender={forceRender}
        /** 操作 modal 为 operation */
        className={cls(clsPrefix, 'normal')}
        width={settings?.width}
        visible={visible}
        onCancel={close}
        onOk={close}
        footer={
          footer ? (
            <Affix offsetBottom={0} target={() => document.getElementById(idRef.current)}>
              <div className={`modal-custom-footer`}>{footer}</div>
            </Affix>
          ) : null
        }
        title={settings?.title}
        closeIcon={<CloseSquareOutlined />}
        wrapProps={{
          id: idRef.current,
          /** 会导致点击 mask 无法 close */
          // ref: wrapperRef,
        }}
      >
        {body}
      </Modal>
      {renderTrigger(props.children)}
    </>
  );
};

export default React.forwardRef(OSDialogModal);

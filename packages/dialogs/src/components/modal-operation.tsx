/* eslint-disable no-param-reassign */
import { CloseSquareOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Space } from 'antd';
import cls from 'classnames';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle } from 'react';
import type { OSDialogModalOperationAPI, OSDialogModalOperationType } from '@ty-one-start/typings';
import { useActionsRef } from '@ty-one-start/utils';
import { OSTrigger as Trigger } from '@ty-one-start/triggers';
import { normalizeRequestOutputs } from '@ty-one-start/utils';
import { useClsPrefix } from '@ty-one-start/utils';
import { useConfirm } from './use-confirm';
import { useVisible } from './use-visible';
import { renderTrigger } from './utils';

const OSDialogModalOperation: React.ForwardRefRenderFunction<
  OSDialogModalOperationAPI,
  PropsWithChildren<OSDialogModalOperationType>
> = (props, ref) => {
  const { settings, actionsRef: propActionsRef, requests } = props;

  const { requestAfterCancel, requestAfterConfirm, requestBeforeUpload } = requests ?? {};
  const clsPrefix = useClsPrefix('os-modal');

  const {
    content,
    danger,
    actions,
    type = 'confirm',
    confirmTriggerSettings,
    confirmTriggerWrapper: ConfirmTriggerWrapper,
    corner,
  } = settings ?? {};

  const { visible, close, open, setVisible, pending } = useVisible({
    onVisibleChange: props.onVisibleChange,
  });

  const {
    confirm,
    cancel,
    requestAfterConfirmLoading,
    requestAfterCancelLoading,
    cancelButtonDisabled,
    confirmButtonDisabled,
  } = useConfirm({
    requestAfterCancel,
    requestAfterConfirm,
  });

  useImperativeHandle(ref, () => {
    return {
      push: async () => {
        open();
        return (await pending()) ?? { confirmed: false };
      },
      pop: () => {
        close({
          confirmed: false,
        });
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

  const handleCancel = async () => {
    const success = await cancel();
    if (success) {
      close({
        confirmed: false,
      });
    }
  };

  const confirmTriggerDOM = (
    <Trigger
      type="button"
      settings={{
        type: 'primary',
        danger,
        text: '??????',
        disabled: confirmButtonDisabled,
        ...confirmTriggerSettings,
      }}
      requests={{
        requestBeforeUpload: async (params) => {
          const rsp = await requestBeforeUpload?.({
            type: 'confirm',
            ...params,
          }).then(normalizeRequestOutputs);

          if (rsp?.error === false) {
            close({
              confirmed: true,
            });
          }

          return rsp;
        },
      }}
      onClick={async () => {
        if (ConfirmTriggerWrapper || confirmTriggerSettings?.upload) {
          return;
        }

        const success = await confirm();
        if (success) {
          close({
            confirmed: true,
          });
        }
      }}
      loading={requestAfterConfirmLoading}
    />
  );

  return (
    <>
      <Modal
        /** ?????? modal ??? normal */
        className={cls(clsPrefix, 'operation')}
        width={settings?.width ?? 400}
        visible={visible}
        title={
          <Space size={5}>
            <InfoCircleOutlined className={cls(`${clsPrefix}-confirm-icon`, type)} />
            <span>{settings?.title}</span>
          </Space>
        }
        closeIcon={<CloseSquareOutlined />}
        footer={
          <Row justify="space-between">
            <Col>{corner}</Col>
            <Col>
              <Row justify="end" gutter={5}>
                <Col>
                  <Space size={5}>
                    {actions?.map((item, index) =>
                      React.cloneElement(item, {
                        key: item.key ?? index,
                      }),
                    )}
                  </Space>
                </Col>
                <Col>
                  <Trigger
                    type="button"
                    settings={{
                      text: '??????',
                      disabled: cancelButtonDisabled,
                    }}
                    loading={requestAfterCancelLoading}
                    onClick={handleCancel}
                  ></Trigger>
                </Col>
                {type === 'confirm' ? (
                  <Col>
                    {ConfirmTriggerWrapper
                      ? React.cloneElement(ConfirmTriggerWrapper, {
                          children: confirmTriggerDOM,
                        })
                      : confirmTriggerDOM}
                  </Col>
                ) : null}
              </Row>
            </Col>
          </Row>
        }
        destroyOnClose
        onCancel={handleCancel}
      >
        {content}
      </Modal>
      {renderTrigger(props.children)}
    </>
  );
};

export default React.forwardRef(OSDialogModalOperation);

/* eslint-disable no-param-reassign */
import { CloseSquareOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Space } from '@ty/antd';
import cls from 'classnames';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle, useState } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import type { OSDialogModalOperationAPI, OSDialogModalOperationType } from '../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useConfirm } from './use-confirm';
import { renderTrigger } from './utils';

const OSDialogModalOperation: React.ForwardRefRenderFunction<
  OSDialogModalOperationAPI,
  PropsWithChildren<OSDialogModalOperationType>
> = (props, ref) => {
  const { settings, actionsRef: propActionsRef, requests } = props;

  const { requestAfterCancel, requestAfterConfirm } = requests ?? {};
  const clsPrefix = useClsPrefix('os-modal');

  const { content, danger, actions, type = 'confirm' } = settings ?? {};
  const [visible, setVisible] = useState(false);

  const {
    promiseRef,
    confirm,
    initPromise,
    cancel,
    close,
    requestAfterConfirmLoading,
    requestAfterCancelLoading,
    cancelButtonDisabled,
    confirmButtonDisabled,
  } = useConfirm({
    onVisibleChange: props.onVisibleChange,
    requestAfterCancel,
    requestAfterConfirm,
  });

  useImperativeHandle(ref, () => {
    return {
      push: async () => {
        setVisible(true);
        initPromise();
        const confirmed = await promiseRef.current!;
        return {
          confirmed,
        };
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

  const handleCancel = async () => {
    const success = await cancel();
    if (success) {
      setVisible(false);
    }
  };

  return (
    <>
      <Modal
        /** 操作 modal 为 normal */
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
              <Button
                {...{
                  size: 'small',
                  loading: requestAfterCancelLoading,
                  disabled: cancelButtonDisabled,
                }}
                onClick={handleCancel}
              >
                取消
              </Button>
            </Col>
            {type === 'confirm' ? (
              <Col>
                <Button
                  {...{
                    type: 'primary',
                    size: 'small',
                    danger,
                    loading: requestAfterConfirmLoading,
                    disabled: confirmButtonDisabled,
                  }}
                  onClick={async () => {
                    const success = await confirm();
                    if (success) {
                      setVisible(false);
                    }
                  }}
                >
                  确认
                </Button>
              </Col>
            ) : null}
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

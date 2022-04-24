/* eslint-disable no-bitwise */
import type { PopoverProps } from '@ty/antd';
import { Col, Popover, Row } from '@ty/antd';
import React from 'react';
import { CloseIconAction } from '@ty-one-start/utils';

export const ErrorPopover: React.FC<{
  clsPrefix: string;
  trigger?: string;
  visible: boolean;
  enableClose: boolean;
  errorList: JSX.Element;
  getPopupContainer: PopoverProps['getPopupContainer'];
  onClose?: () => void;
}> = ({
  clsPrefix,
  trigger,
  enableClose,
  visible,
  errorList,
  children,
  onClose,
  getPopupContainer,
}) => {
  return (
    <Popover
      autoAdjustOverflow
      placement="topLeft"
      overlayClassName={`${clsPrefix}-popover-overlay`}
      trigger={trigger}
      visible={visible}
      content={
        <Row align="top" justify="space-between">
          <Col>{errorList}</Col>
          <Col>
            {enableClose && (
              <CloseIconAction
                style={{
                  marginLeft: 4,
                  fontSize: 10,
                }}
                onClick={onClose}
              />
            )}
          </Col>
        </Row>
      }
      getPopupContainer={getPopupContainer}
    >
      {children}
    </Popover>
  );
};

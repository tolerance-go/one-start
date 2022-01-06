import { Popover } from '@ty/antd';
import { useClickAway } from 'ahooks';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle, useRef, useState } from 'react';
import type { OSDialogPopoverAPI, OSDialogPopoverType } from '../../typings';
import { useActionsRef } from '../hooks/use-actions-ref';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useVisible } from './use-visible';
import { renderTrigger } from './utils';

const OSDialogPopover: React.ForwardRefRenderFunction<
  OSDialogPopoverAPI,
  PropsWithChildren<OSDialogPopoverType>
> = (props, ref) => {
  const { settings, actionsRef: propActionsRef } = props;
  const clsPrefix = useClsPrefix('os-popover');

  const { content, title, align, placement, arrowPointAtCenter } = settings ?? {};

  const { visible, close, setVisible, open, pending } = useVisible({
    onVisibleChange: props.onVisibleChange,
    initialVisible: props.settings?.initialVisible,
  });

  useImperativeHandle(ref, () => {
    return {
      push: async () => {
        open();
        await pending();
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

  const wrapperSpanRef = useRef<HTMLSpanElement>(null);
  const [unionId] = useState(() => Math.random().toString());
  useClickAway(() => {
    if (visible) {
      close();
    }
  }, [wrapperSpanRef, () => document.getElementById(unionId)]);

  return (
    <Popover
      align={align}
      id={unionId}
      title={title}
      className={clsPrefix}
      visible={visible}
      content={content}
      placement={placement}
      autoAdjustOverflow
      arrowPointAtCenter={arrowPointAtCenter}
    >
      <span ref={wrapperSpanRef}>{renderTrigger(props.children)}</span>
    </Popover>
  );
};

export default React.forwardRef(OSDialogPopover);

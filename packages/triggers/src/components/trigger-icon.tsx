import { LoadingOutlined } from '@ant-design/icons/lib/icons';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React, { useContext, useState } from 'react';
import type { OSTriggerIconAPI, OSTriggerIconType } from '@ty-one-start/typings';
import { OSDialogAPIContext, OSDialogTypeContext } from '@ty-one-start/dialogs';
import { useActionsRef } from '../hooks/use-actions-ref';
import { logRequestMessage } from '../utils/log-request-message';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';

const OSTriggerIcon: React.ForwardRefRenderFunction<OSTriggerIconAPI, OSTriggerIconType> = (
  props,
) => {
  const {
    settings,
    requests,
    onClick,
    actionsRef: propActionsRef,
    __shouldPush,
    __disabled,
  } = props;

  const { manualPush = false, id, className, content, style, loading } = settings ?? {};
  const [requestAfterClickLoading, setRequestAfterClickLoading] = useState(false);
  const [disabled, setDisabled] = useMergedState(settings?.initialDisabled, {
    value: settings?.disabled ?? __disabled,
  });

  const dialogType = useContext(OSDialogTypeContext);

  const dialogApisRef = useContext(OSDialogAPIContext);

  const update = (settings_?: OSTriggerIconType['settings']) => {
    if (settings_?.disabled != null) {
      setDisabled(settings_.disabled);
    }
  };

  const pushDialog = async () => {
    if (!manualPush && __shouldPush) {
      setDisabled(true);
      await dialogApisRef.current?.push();
      setDisabled(false);
    }
  };

  const popDialog = async () => {
    if (!manualPush && __shouldPush) {
      await dialogApisRef.current?.pop();
    }
  };

  const actionsRef = useActionsRef(
    {
      setDisabled,
      update,
      setLoading: setRequestAfterClickLoading,
    },
    propActionsRef,
  );

  const requestAfterClick = async () => {
    if (!requests?.requestAfterClick) {
      if (dialogType === 'modal' || dialogType === 'modal-operation' || dialogType === 'drawer') {
        pushDialog();
      }

      return;
    }

    setRequestAfterClickLoading(true);
    const { error } = await requests
      .requestAfterClick({
        actions: actionsRef.current,
      })
      .then(normalizeRequestOutputs)
      .then(logRequestMessage());
    setRequestAfterClickLoading(false);

    if (!error) {
      if (dialogType === 'modal' || dialogType === 'modal-operation' || dialogType === 'drawer') {
        pushDialog();
      }
    }
  };

  const handleClick = (event?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const loading_ = loading ?? requestAfterClickLoading;

    if (disabled) {
      event?.stopPropagation();
      event?.preventDefault();
      return false;
    }

    if (loading_) return true;
    onClick?.({ event, actions: actionsRef.current });

    requestAfterClick();

    return true;
  };

  if (content == null) {
    return null;
  }

  if (requestAfterClickLoading) {
    return <LoadingOutlined />;
  }

  return React.cloneElement(content, {
    style: {
      ...style,
      cursor: disabled ? 'not-allowed' : style?.cursor ?? 'pointer',
      color: disabled ? '#ccc' : style?.color,
    },
    id,
    className,
    onClick: handleClick,
    onMouseEnter: () => {
      if (dialogType === 'popover') {
        pushDialog();
      }
    },
    onMouseLeave: () => {
      if (dialogType === 'popover') {
        popDialog();
      }
    },
  });
};

export default React.forwardRef(OSTriggerIcon);

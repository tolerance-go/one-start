import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Badge, Button, Typography, Upload } from '@ty/antd';
import type { RcFile } from '@ty/antd/lib/upload';
import cls from 'classnames';
import utl from 'lodash';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { ReactNode } from 'react';
import React, { useContext, useImperativeHandle, useState } from 'react';
import { OSDialogAPIContext } from '../dialog/contexts';
import { useActionsRef } from '../hooks/use-actions-ref';
import type { OSTriggerButtonAPI, OSTriggerButtonType } from '../typings';
import { logRequestMessage } from '../utils/log-request-message';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useLoading } from '../utils/use-loading';
import { renderTooltip as renderTooltipUtl } from './utils/render-tooltip';

const OSTriggerButton: React.ForwardRefRenderFunction<OSTriggerButtonAPI, OSTriggerButtonType> = (
  props,
  ref,
) => {
  const {
    settings,
    requests,
    onClick,
    loading,
    actionsRef: propActionsRef,
    __shouldPush,
    __disabled,
  } = props;

  const { text, danger, icon, tooltip, manualPush = false, block, plain, upload } = settings ?? {};

  const requestAfterSyncLoading = useLoading();

  const clsPrefix = useClsPrefix('os-trigger');

  const [disabled, setDisabled] = useMergedState(settings?.initialDisabled, {
    value: settings?.disabled ?? __disabled,
  });
  const dialogApisRef = useContext(OSDialogAPIContext);
  const [requestAfterClickLoading, setRequestAfterClickLoading] = useState(false);

  const requestAfterProcessingLoading = useLoading();

  const pushDialog = async () => {
    if (!manualPush && __shouldPush) {
      setDisabled(true);
      await dialogApisRef.current?.push();
      setDisabled(false);
    }
  };

  const update = (settings_?: OSTriggerButtonType['settings']) => {
    if (settings_?.disabled != null) {
      setDisabled(settings_.disabled);
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
      pushDialog();
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
      pushDialog();
    }
  };

  const requestAfterSync = async () => {
    if (!requests?.requestAfterSync) return;

    requestAfterSyncLoading.switch();
    await requests.requestAfterSync();
    requestAfterSyncLoading.switch();
  };

  const requestAfterProcessing = async () => {
    if (!requests?.requestAfterProcessing) return;

    requestAfterProcessingLoading.switch();
    await requests.requestAfterProcessing();
    requestAfterProcessingLoading.switch();
  };

  useImperativeHandle(ref, () => ({
    update,
    setLoading: setRequestAfterClickLoading,
    setDisabled,
  }));

  const uploadFile = utl.debounce(async (files: RcFile[]) => {
    if (!requests?.requestBeforeUpload) return;

    setRequestAfterClickLoading(true);
    await requests
      .requestBeforeUpload({
        files,
      })
      .then(normalizeRequestOutputs)
      .then(logRequestMessage());
    setRequestAfterClickLoading(false);
  }, 50);

  const handleClick = (event?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const loading_ = loading ?? requestAfterClickLoading;
    if (loading_) return;
    onClick?.({ event, actions: actionsRef.current });

    if (upload) return;
    if (disabled) return;

    requestAfterClick();
    requestAfterSync();
    requestAfterProcessing();
  };

  const renderIcon = (style?: React.CSSProperties) => {
    if (requestAfterClickLoading) return null;

    const icon_ = icon || (requests?.requestAfterSync ? <SyncOutlined /> : undefined);

    if (React.isValidElement(icon_)) {
      const iconEl: React.ReactElement = icon_;
      return React.cloneElement(icon_, {
        ...iconEl.props,
        spin: requestAfterSyncLoading.loading,
        style: {
          ...iconEl.props.style,
          ...style,
          display: 'inline-flex',
        },
      });
    }

    return icon_;
  };

  const renderTooltip = (style?: React.CSSProperties) => {
    return renderTooltipUtl(tooltip, style);
  };

  const renderText = (_text?: React.ReactNode) => {
    if (upload) {
      const { suffixs, maxCount, multiple, directory } = upload;
      return (
        <Upload
          name="file"
          showUploadList={false}
          accept={suffixs?.join(',')}
          maxCount={maxCount}
          multiple={multiple}
          directory={directory}
          beforeUpload={(file, fileList) => {
            uploadFile(fileList);
            return false;
          }}
        >
          {_text}
        </Upload>
      );
    }
    return _text;
  };

  const renderLoading = (style?: React.CSSProperties) => {
    return loading || requestAfterClickLoading ? (
      <LoadingOutlined
        style={{
          display: 'inline-flex',
          ...style,
        }}
      />
    ) : null;
  };

  const renderProcessing = (style?: React.CSSProperties) => {
    return requestAfterProcessingLoading.loading ? (
      <Badge status="processing" style={style} />
    ) : null;
  };

  const renderButton = (content?: ReactNode) => {
    const className = cls(clsPrefix, {
      'link-type': settings?.type === 'link',
    });

    if (plain) {
      const Component = settings?.type === 'link' ? Typography.Link : Typography.Text;

      return (
        <Component
          className={className}
          style={{
            display: block ? 'block' : undefined,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onClick={handleClick}
          disabled={disabled}
          type={danger ? 'danger' : undefined}
        >
          {renderIcon({
            marginRight: 5,
          })}
          {renderProcessing({
            marginRight: 5,
          })}
          {renderLoading({
            marginRight: 5,
          })}
          {renderTooltip({
            marginRight: 5,
          })}
          {renderText(content)}
        </Component>
      );
    }

    return (
      <Button
        className={className}
        onClick={handleClick}
        type={settings?.type}
        disabled={disabled}
        danger={danger}
        icon={renderIcon({
          marginRight: 5,
        })}
        block={block}
        loading={icon ? false : loading || requestAfterClickLoading}
      >
        {icon
          ? renderLoading({
              marginRight: 5,
            })
          : null}
        {renderTooltip({
          marginRight: 5,
        })}
        {renderText(content)}
      </Button>
    );
  };

  return renderButton(text);
};

export default React.forwardRef(OSTriggerButton);

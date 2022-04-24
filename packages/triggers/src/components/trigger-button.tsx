import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Badge, Button, Space, Typography, Upload } from '@ty/antd';
import type { RcFile } from '@ty/antd/lib/upload';
import cls from 'classnames';
import utl from 'lodash';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { ReactNode } from 'react';
import React, { useContext, useImperativeHandle, useState } from 'react';
import { OSDialogAPIContext } from '@ty-one-start/dialogs';
import { useActionsRef } from '@ty-one-start/utils';
import type { OSTriggerButtonAPI, OSTriggerButtonType } from '@ty-one-start/typings';
import { logRequestMessage } from '@ty-one-start/utils';
import { normalizeRequestOutputs } from '@ty-one-start/utils';
import { useClsPrefix } from '@ty-one-start/utils';
import { useLoading } from '@ty-one-start/utils';
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
    className: propClassName,
  } = props;

  const {
    text,
    danger,
    icon,
    tooltip,
    manualPush = false,
    block,
    plain,
    upload,
    size,
    id,
    className: settingsClassName,
    mergeIconInLoading = true,
  } = settings ?? {};

  const finalClassName = settingsClassName ?? propClassName;

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
    if (mergeIconInLoading && (requestAfterClickLoading || loading)) return null;

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
          id={id}
          className={cls(className, finalClassName)}
          style={{
            display: block ? 'block' : undefined,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onClick={handleClick}
          disabled={disabled}
          type={danger ? 'danger' : undefined}
        >
          <Space size={5}>
            {renderIcon()}
            {renderProcessing()}
            {renderLoading()}
            {renderTooltip()}
            {renderText(content)}
          </Space>
        </Component>
      );
    }

    return (
      <Button
        id={id}
        size={size}
        className={cls(className, finalClassName)}
        onClick={handleClick}
        type={settings?.type}
        disabled={disabled}
        danger={danger}
        block={block}
        loading={icon ? false : loading || requestAfterClickLoading}
        style={{
          cursor: (loading || requestAfterClickLoading) && icon ? 'default' : 'pointer',
        }}
      >
        <Space size={5}>
          {renderIcon()}
          {icon ? renderLoading() : null}
          {renderTooltip()}
          {renderText(content)}
        </Space>
      </Button>
    );
  };

  return renderButton(text);
};

export default React.forwardRef(OSTriggerButton);

import { message } from '@ty/antd';
import type { ArgsProps } from '@ty/antd/lib/message';
import type { PropsWithChildren } from 'react';
import React, { useImperativeHandle } from 'react';
import type { OSDialogMessageAPI, OSDialogMessageType } from '../../typings';

const OSDialogMessage: React.ForwardRefRenderFunction<
  OSDialogMessageAPI,
  PropsWithChildren<OSDialogMessageType>
> = (props, ref) => {
  const { settings } = props;
  useImperativeHandle(ref, () => {
    return {
      push: async (settings_) => {
        const type = settings_?.type ?? settings?.type ?? ('success' as ArgsProps['type']);
        const title = settings_?.title ?? settings?.title ?? '';
        message.open({
          type,
          content: title,
          duration: 2,
        });
      },
      pop: () => {},
      update: () => {},
    };
  });

  return <>{props.children}</>;
};

export default React.forwardRef(OSDialogMessage);

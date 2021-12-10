import { message } from '@ty/antd';
import type { RequestOutputs } from '../typings';
import type { OSResMessage } from '../typings/message';

export const logRequestMessage =
  <
    T extends {
      message?: OSResMessage;
    },
  >(
    defaultMessage?: OSResMessage,
  ) =>
  (ro: RequestOutputs<T>) => {
    const { data, error } = ro;

    if (!error) {
      const msg = data?.message ?? defaultMessage;
      if (msg) {
        const { type, text } =
          typeof msg === 'string'
            ? {
                text: msg,
                type: 'success',
              }
            : msg;

        message[type](text);
      }
    }

    return ro;
  };

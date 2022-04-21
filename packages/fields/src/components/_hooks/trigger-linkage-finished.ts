import type EventEmitter from 'eventemitter3';
import { useEffect } from 'react';
import { eventNames } from '../@ty-one-start/forms/constants';

export const useTriggerLinkageFinished = ({
  name,
  eventBus,
  onLinkageFinished,
}: {
  name?: string;
  eventBus?: EventEmitter;
  onLinkageFinished?: () => void;
}) => {
  useEffect(() => {
    const cb = (names?: string[]) => {
      if (name && names?.includes(name)) {
        onLinkageFinished?.();
      }
    };
    eventBus?.addListener(eventNames.linkageFinished, cb);
    return () => {
      eventBus?.off(eventNames.linkageFinished, cb);
    };
  }, []);
};

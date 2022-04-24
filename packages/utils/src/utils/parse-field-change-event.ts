import type { OSFieldChangeEventType, OSFieldValueType } from '@ty-one-start/typings';

interface ChangeEvent {
  target: unknown;
}

export const parseFieldChangeEvent = (event: OSFieldChangeEventType): OSFieldValueType => {
  if (typeof event === 'object') {
    if ((event as ChangeEvent)?.target) {
      return (event as ChangeEvent)?.target as OSFieldValueType;
    }
  }
  return event as OSFieldValueType;
};

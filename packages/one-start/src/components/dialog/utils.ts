import React from 'react';
import { OSTriggerType } from '../typings';

export const renderTrigger = (item: React.ReactNode) => {
  if (React.isValidElement(item)) {
    return React.cloneElement<OSTriggerType>(item, {
      ...item.props,
      __shouldPush: true,
    });
  }
  return item;
};

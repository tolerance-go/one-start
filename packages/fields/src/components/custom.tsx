import React from 'react';
import type { OSCustomFieldType } from '@ty-one-start/typings';

const OSActionsField: React.FC<OSCustomFieldType> = (props) => {
  const { settings } = props;
  const { element } = settings ?? {};

  return element ? React.cloneElement(element, props) : null;
};

export default OSActionsField;
export const Settings: React.FC<OSCustomFieldType['settings']> = () => <></>;

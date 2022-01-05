import { Space } from '@ty/antd';
import React from 'react';
import type { OSActionsFieldType } from '../../typings';

const OSActionsField: React.FC<OSActionsFieldType> = (props) => {
  const { settings } = props;

  const {
    actions,
    splitMarker = <span style={{ color: '#ddd' }}>|</span>,
    gap = 0,
  } = settings ?? {};

  return (
    <Space size={gap} split={splitMarker}>
      {actions?.map((item, index) => {
        if (item == null) {
          return null;
        }
        return React.cloneElement(item, {
          ...item.props,
          key: item.key ?? index,
        });
      })}
    </Space>
  );
};

export default OSActionsField;
export const Settings: React.FC<OSActionsFieldType['settings']> = () => <></>;

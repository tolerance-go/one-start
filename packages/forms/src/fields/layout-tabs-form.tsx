import utl from 'lodash';
import React from 'react';
import { OSLayoutForm } from '../components';
import type {
  OSLayoutTabsFormAPI,
  OSLayoutTabsFormFieldAPI,
  OSLayoutTabsFormFieldType,
} from '@ty-one-start/typings';

const OSLayoutTabsFormField: React.ForwardRefRenderFunction<
  OSLayoutTabsFormFieldAPI,
  OSLayoutTabsFormFieldType
> = (props, ref) => {
  const {
    text,
    onValueChange,
    settings,
    requests,
    mode = 'read',
    value: _value,
    onChange: _onChange,
  } = props;

  const { bordered, autoFocus, disabled, ...layoutFormSettings } = settings ?? {};

  if (mode === 'read') {
    return (
      <OSLayoutForm
        type="tabs-form"
        settings={{
          ...layoutFormSettings,
          forms: utl.mapValues(layoutFormSettings?.forms, (item) => ({
            ...item,
            settings: {
              ...item.settings,
              fieldItemSettings: {
                readonly: true,
                labelAlign: 'left' as 'left',
                ...item.settings?.fieldItemSettings,
              },
            },
          })),
        }}
        requests={requests}
        ref={ref as React.MutableRefObject<OSLayoutTabsFormAPI>}
        value={text ?? _value}
        onChange={_onChange}
        tabClassName="readonly-tab-form-field"
      />
    );
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: OSLayoutTabsFormFieldType['onChange'] = (value) => {
      onValueChange?.(value);
      return _onChange?.(value);
    };

    return (
      <OSLayoutForm
        type="tabs-form"
        settings={layoutFormSettings}
        requests={requests}
        ref={ref as React.MutableRefObject<OSLayoutTabsFormAPI>}
        value={_value}
        onChange={onChange}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSLayoutTabsFormField);

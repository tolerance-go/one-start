import React from 'react';
import OSLayoutForm from '../layout-form';
import type {
  OSLayoutTabsFormAPI,
  OSLayoutTabsFormFieldType,
  OSLayoutTabsFormFieldAPI,
} from '../typings';
import utl from 'lodash';

const OSLayoutTabsFormField: React.ForwardRefRenderFunction<
  OSLayoutTabsFormFieldAPI,
  OSLayoutTabsFormFieldType
> = (props, ref) => {
  const {
    text,
    onChangeHook,
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
                ...item.settings?.fieldItemSettings,
              },
            },
          })),
        }}
        requests={requests}
        ref={ref as React.MutableRefObject<OSLayoutTabsFormAPI>}
        value={text ?? _value}
        onChange={_onChange}
      />
    );
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: OSLayoutTabsFormFieldType['onChange'] = (value) => {
      onChangeHook?.(value);
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

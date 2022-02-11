import React from 'react';
import OSForm from '../form';
import type { OSFormAPI, OSFormFieldType } from '../../typings';
import type { OSFormFieldAPI } from '../../typings';

const OSFormField: React.ForwardRefRenderFunction<OSFormFieldAPI, OSFormFieldType> = (
  props,
  ref,
) => {
  const {
    text,
    onChangeHook,
    settings,
    requests,
    mode = 'read',
    value: _value,
    onChange: _onChange,
  } = props;

  const { bordered, autoFocus, disabled, ...formSettings } = settings ?? {};

  if (mode === 'read') {
    return (
      <OSForm
        settings={{
          ...formSettings,
          fieldItemSettings: {
            readonly: true,
            labelAlign: 'left' as 'left',
            ...formSettings?.fieldItemSettings,
          },
        }}
        requests={requests}
        ref={ref as React.MutableRefObject<OSFormAPI>}
        value={text ?? _value}
        onChange={_onChange}
      />
    );
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: OSFormFieldType['onChange'] = (value) => {
      onChangeHook?.(value);
      return _onChange?.(value);
    };

    return (
      <OSForm
        settings={formSettings}
        requests={requests}
        ref={ref as React.MutableRefObject<OSFormAPI>}
        value={_value}
        onChange={onChange}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSFormField);

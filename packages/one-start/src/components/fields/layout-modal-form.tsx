import React from 'react';
import OSLayoutForm from '../layout-form';
import type { OSLayoutModalFormAPI, OSLayoutModalFormFieldType } from '../../typings';
import type { OSLayoutModalFormFieldAPI } from '../../typings';

const OSLayoutModalFormField: React.ForwardRefRenderFunction<
  OSLayoutModalFormFieldAPI,
  OSLayoutModalFormFieldType
> = (props, ref) => {
  const {
    text,
    onChangeHook,
    settings,
    requests,
    mode = 'read',
    value: _value,
    onChange: _onChange,
    onVisibleChange,
  } = props;

  const { bordered, autoFocus, disabled, ...layoutFormSettings } = settings ?? {};

  if (mode === 'read') {
    return (
      <OSLayoutForm
        type="modal-form"
        settings={{
          ...layoutFormSettings,
          formSettings: {
            ...layoutFormSettings.formSettings,
            fieldItemSettings: {
              ...layoutFormSettings.formSettings?.fieldItemSettings,
              readonly: true,
            },
          },
        }}
        requests={requests}
        ref={ref as React.MutableRefObject<OSLayoutModalFormAPI>}
        value={text ?? _value}
        onChange={_onChange}
        onVisibleChange={onVisibleChange}
      />
    );
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: OSLayoutModalFormFieldType['onChange'] = (value) => {
      onChangeHook?.(value);
      return _onChange?.(value);
    };

    return (
      <OSLayoutForm
        type="modal-form"
        settings={layoutFormSettings}
        requests={requests}
        ref={ref as React.MutableRefObject<OSLayoutModalFormAPI>}
        value={_value}
        onChange={onChange}
        onVisibleChange={onVisibleChange}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSLayoutModalFormField);

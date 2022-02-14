import React from 'react';
import type {
  OSLayoutModalFormAPI,
  OSLayoutModalFormFieldAPI,
  OSLayoutModalFormFieldType,
} from '../../typings';
import OSLayoutForm from '../layout-form';

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
              readonly: true,
              labelAlign: 'left' as 'left',
              ...layoutFormSettings.formSettings?.fieldItemSettings,
            },
          },
        }}
        requests={requests}
        ref={ref as React.MutableRefObject<OSLayoutModalFormAPI>}
        value={text ?? _value}
        onChange={_onChange}
        onVisibleChange={onVisibleChange}
        formWrapperClassName="readonly-modal-form-field"
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

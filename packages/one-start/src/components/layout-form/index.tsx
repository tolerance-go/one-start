import React, { useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { OSReferencesCollectorDispatchContext } from '../providers/references';
import type {
  OSLayoutFormAPIBase,
  OSLayoutFormType,
  OSLayoutModalFormType,
  OSLayoutTabsFormType,
  OSLayoutFormAPI,
  OSLayoutModalFormAPI,
  OSLayoutTabsFormAPI,
} from '../typings';
import { OSLayoutFormAPIContext } from './contexts';
import OSLayoutModalForm from './modal-form';
import OSLayoutTabsForm from './tabs-form';

const OSLayoutForm: React.ForwardRefRenderFunction<OSLayoutFormAPI, OSLayoutFormType> = (
  props,
  ref,
) => {
  const innerRef = useRef<OSLayoutFormAPI>(null);

  const referencesDispatch = useContext(OSReferencesCollectorDispatchContext);

  useImperativeHandle(ref, () => {
    const apis: OSLayoutFormAPI = innerRef.current!;
    return apis;
  });

  useEffect(() => {
    const apis: OSLayoutFormAPI = innerRef.current!;
    if (props.refKey) {
      if (props.type === 'modal-form') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'layout-forms.modal-form',
            key: props.refKey,
            apis: apis as OSLayoutModalFormAPI,
          },
        });
      }

      if (props.type === 'tabs-form') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'layout-forms.tabs-form',
            key: props.refKey,
            apis: apis as OSLayoutTabsFormAPI,
          },
        });
      }
    }
  });

  const renderContent = () => {
    if (props.type === 'modal-form') {
      return (
        <OSLayoutModalForm
          ref={innerRef as React.RefObject<OSLayoutModalFormAPI>}
          {...props}
        ></OSLayoutModalForm>
      );
    }

    if (props.type === 'tabs-form') {
      return (
        <OSLayoutTabsForm
          ref={innerRef as React.RefObject<OSLayoutTabsFormAPI>}
          {...props}
        ></OSLayoutTabsForm>
      );
    }

    return null;
  };

  return (
    <OSLayoutFormAPIContext.Provider value={innerRef}>
      {renderContent()}
    </OSLayoutFormAPIContext.Provider>
  );
};

export default React.forwardRef(OSLayoutForm);

export const LayoutFormAPIBase: React.FC<OSLayoutFormAPIBase> = () => <></>;
export const LayoutModalFormSettings: React.FC<OSLayoutModalFormType['settings']> = () => <></>;
export const LayoutModalFormAPI: React.FC<OSLayoutModalFormAPI> = () => <></>;

export const LayoutTabsFormSettings: React.FC<OSLayoutTabsFormType['settings']> = () => <></>;
export const LayoutTabsFormAPI: React.FC<OSLayoutTabsFormAPI> = () => <></>;

import React, { useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { OSReferencesCollectorDispatchContext } from '../providers/references';
import type {
  OSTriggerAPI,
  OSTriggerButtonAPI,
  OSTriggerButtonType,
  OSTriggerDropdownAPI,
  OSTriggerDropdownType,
  OSTriggerType,
} from '../typings';
import OSTriggerButton from './trigger-button';
import OSTriggerDropdown from './trigger-dropdown';

const OSTrigger: React.ForwardRefRenderFunction<OSTriggerAPI, OSTriggerType> = (props, ref) => {
  const { type, refKey, ...rest } = props;

  const inlineRef = useRef<OSTriggerAPI>(null);
  const referencesDispatch = useContext(OSReferencesCollectorDispatchContext);

  useImperativeHandle(ref, () => {
    const apis: OSTriggerAPI = inlineRef.current!;

    return apis;
  });

  useEffect(() => {
    const apis: OSTriggerAPI = inlineRef.current!;
    if (refKey) {
      if (type === 'button') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'triggers.buttons',
            key: refKey,
            apis: apis as OSTriggerButtonAPI,
          },
        });
      }
      if (type === 'dropdown') {
        referencesDispatch({
          type: 'registe',
          payload: {
            type: 'triggers.dropdowns',
            key: refKey,
            apis: apis as OSTriggerDropdownAPI,
          },
        });
      }
    }
  });

  if (type === 'button') {
    return <OSTriggerButton ref={inlineRef} {...rest} />;
  }

  if (type === 'dropdown') {
    return <OSTriggerDropdown ref={inlineRef} {...rest} />;
  }

  return null;
};

export default React.forwardRef(OSTrigger);

export const TriggerButtonSettings: React.FC<OSTriggerButtonType['settings']> = () => <></>;
export const TriggerButtonAPI: React.FC<OSTriggerButtonAPI> = () => <></>;
export const TriggerButtonRequests: React.FC<OSTriggerButtonType['requests']> = () => <></>;

export const TriggerDropdownSettings: React.FC<OSTriggerDropdownType['settings']> = () => <></>;
export const TriggerDropdownAPI: React.FC<OSTriggerDropdownAPI> = () => <></>;
export const TriggerDropdownRequests: React.FC<OSTriggerDropdownType['requests']> = () => <></>;

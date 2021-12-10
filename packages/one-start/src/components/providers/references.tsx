/* eslint-disable no-param-reassign */
import utl from 'lodash';
import type { PropsWithChildren } from 'react';
import React, {
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type {
  OSDialogMessageAPI,
  OSDialogDrawerAPI,
  OSDialogModalAPI,
  OSDialogModalOperationAPI,
  OSDialogPopconfirmAPI,
  OSDialogPopoverAPI,
  OSFormAPI,
  OSTableAPI,
  OSTriggerButtonAPI,
  OSTriggerDropdownAPI,
  RecordType,
  OSLayoutModalFormAPI,
  OSLayoutTabsFormAPI,
} from '../typings';

export type OSReferencesCollectorKeys = {
  dialogs?: {
    messages?: Record<string, string>;
    modals?: Record<string, string>;
    modalOperations?: Record<string, string>;
    popconfirms?: Record<string, string>;
    popovers?: Record<string, string>;
  };
  tables?: Record<string, string>;
  forms?: Record<string, string>;
  triggers?: {
    buttons?: Record<string, string>;
    dropdowns?: Record<string, string>;
  };
};

export type OSReferencesCollectorType<
  Keys extends OSReferencesCollectorKeys = OSReferencesCollectorKeys,
> = {
  dialogs?: Keys['dialogs'] extends RecordType
    ? {
        messages?: { [key in keyof Keys['dialogs']['messages']]: OSDialogMessageAPI | null };
        modals?: { [key in keyof Keys['dialogs']['modals']]: OSDialogModalAPI | null };
        modalOperations?: {
          [key in keyof Keys['dialogs']['modalOperations']]: OSDialogModalOperationAPI | null;
        };
        popconfirms?: {
          [key in keyof Keys['dialogs']['popconfirms']]: OSDialogPopconfirmAPI | null;
        };
        popovers?: { [key in keyof Keys['dialogs']['popovers']]: OSDialogPopoverAPI | null };
      }
    : undefined;
  tables?: { [key in keyof Keys['tables']]: OSTableAPI | null };
  forms?: { [key in keyof Keys['forms']]: OSFormAPI | null };
  triggers?: Keys['triggers'] extends RecordType
    ? {
        buttons?: { [key in keyof Keys['triggers']['buttons']]: OSTriggerButtonAPI | null };
        dropdowns?: { [key in keyof Keys['triggers']['dropdowns']]: OSTriggerDropdownAPI | null };
      }
    : undefined;
};

const rootReferences: OSReferencesCollectorType = {};

export const OSReferencesCollectorContext =
  React.createContext<OSReferencesCollectorType>(rootReferences);
export const OSReferencesCollectorDispatchContext = React.createContext<
  React.Dispatch<OSReferencesActions>
>(() => {});

export type OSReferencesActions =
  | {
      type: 'registe';
      payload:
        | {
            type: 'dialogs.messages';
            key: string;
            apis: OSDialogMessageAPI;
          }
        | {
            type: 'dialogs.modals';
            key: string;
            apis: OSDialogModalAPI;
          }
        | {
            type: 'dialogs.drawers';
            key: string;
            apis: OSDialogDrawerAPI;
          }
        | {
            type: 'dialogs.modalOperations';
            key: string;
            apis: OSDialogModalOperationAPI;
          }
        | {
            type: 'dialogs.popconfirms';
            key: string;
            apis: OSDialogPopconfirmAPI;
          }
        | {
            type: 'dialogs.popovers';
            key: string;
            apis: OSDialogPopoverAPI;
          }
        | {
            type: 'tables';
            key: string;
            apis: OSTableAPI;
          }
        | {
            type: 'forms';
            key: string;
            apis: OSFormAPI;
          }
        | {
            type: 'triggers.buttons';
            key: string;
            apis: OSTriggerButtonAPI;
          }
        | {
            type: 'triggers.dropdowns';
            key: string;
            apis: OSTriggerDropdownAPI;
          }
        | {
            type: 'layout-forms.modal-form';
            key: string;
            apis: OSLayoutModalFormAPI;
          }
        | {
            type: 'layout-forms.tabs-form';
            key: string;
            apis: OSLayoutTabsFormAPI;
          };
    }
  | {
      type: 'reset';
    };

export const referenceInit = (): OSReferencesCollectorType => {
  return {};
};

function reducer(references: OSReferencesCollectorType, action: OSReferencesActions) {
  if (action.type === 'registe') {
    const { type: refType, apis, key } = action.payload;
    utl.set(references, `${refType}.${key}`, apis);
  }
  if (action.type === 'reset') {
    return referenceInit();
  }
  return { ...references };
}

export const useRefsRef = <T extends OSReferencesCollectorKeys>(refKeys: T) => {
  const refsRef = useRef<OSReferencesCollectorType<typeof refKeys>>(null);

  return {
    refKeys,
    refsRef,
  };
};

export type OSReferencesCollectorProviderWrapperProps = {};

const OSReferencesCollectorProviderWrapper: React.ForwardRefRenderFunction<
  OSReferencesCollectorType,
  PropsWithChildren<OSReferencesCollectorProviderWrapperProps>
> = (props, ref) => {
  const [references, dispatch] = useReducer<
    (
      references: OSReferencesCollectorType,
      action: OSReferencesActions,
    ) => OSReferencesCollectorType,
    OSReferencesCollectorType
  >(reducer, rootReferences, referenceInit);

  const upperReferences = useContext(OSReferencesCollectorContext);
  const upperDispatch = useContext(OSReferencesCollectorDispatchContext);

  const scopeRefs = useMemo(() => {
    return utl.merge({}, upperReferences, references);
  }, [references, upperReferences]);

  const dispatcher = useCallback(
    (action: OSReferencesActions) => {
      upperDispatch(action);
      dispatch(action);
    },
    [upperDispatch],
  );

  useImperativeHandle(ref, () => scopeRefs);

  return (
    <OSReferencesCollectorDispatchContext.Provider value={dispatcher}>
      <OSReferencesCollectorContext.Provider value={scopeRefs}>
        {props.children}
      </OSReferencesCollectorContext.Provider>
    </OSReferencesCollectorDispatchContext.Provider>
  );
};

export default React.forwardRef(OSReferencesCollectorProviderWrapper);

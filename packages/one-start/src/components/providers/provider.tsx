import type { PropsWithChildren } from 'react';
import React from 'react';
import { ExtraValueTypesContext } from './extra-value-types';
import OSEditableTableField from '../fields/editable-table';
import OSAttachmentTableField from '../fields/attachment-table';
import OSLayoutModalFormField from '../fields/layout-modal-form';
import OSLayoutTabsFormField from '../fields/layout-tabs-form';
import OSFormField from '../fields/form';

import type { RenderFieldOptions } from '../../typings';
import { OSConfigProviderWrapper } from './config';
import type { OSReferencesCollectorType } from './references';
import OSReferencesCollectorProviderWrapper from './references';
import type {
  OSEditableTableFieldAPI,
  OSEditableTableFieldValueType,
  OSLayoutModalFormFieldAPI,
  OSLayoutModalFormFieldValueType,
  OSLayoutTabsFormFieldAPI,
  OSLayoutTabsFormFieldValueType,
  OSAttachmentTableFieldAPI,
  OSAttachmentTableFieldValueType,
  OSFormFieldAPI,
  OSFormFieldValueType,
} from '../../typings';
import OSDialog from '../dialog';
import { useRefsRef } from './references';
import type { SizeType } from '@ty/antd/es/config-provider/SizeContext';
import type { OSFieldValueType } from '../../typings/components/field';

export const globalRefKeys = {
  dialogs: {
    messages: {
      globalMessage: 'globalMessage',
    },
  },
};

const valueTypes = {
  // eslint-disable-next-line func-names
  'editable-table': function <ExtraFieldValueType = OSFieldValueType>(
    options: RenderFieldOptions<ExtraFieldValueType>,
  ) {
    return (
      <OSEditableTableField
        {...options.props}
        ref={options?.ref as React.RefObject<OSEditableTableFieldAPI>}
        mode={options.mode}
        settings={options.fieldSettings}
        value={options?.value as OSEditableTableFieldValueType}
        text={options?.text as OSEditableTableFieldValueType}
        requests={options.requests}
      />
    );
  },
  // eslint-disable-next-line func-names
  'attachment-table': function <ExtraFieldValueType = OSFieldValueType>(
    options: RenderFieldOptions<ExtraFieldValueType>,
  ) {
    return (
      <OSAttachmentTableField
        {...options.props}
        ref={options?.ref as React.RefObject<OSAttachmentTableFieldAPI>}
        mode={options.mode}
        settings={options.fieldSettings}
        value={options?.value as OSAttachmentTableFieldValueType}
        text={options?.text as OSAttachmentTableFieldValueType}
        requests={options.requests}
      />
    );
  },
  // eslint-disable-next-line func-names
  'layout-modal-form': function <ExtraFieldValueType = OSFieldValueType>(
    options: RenderFieldOptions<ExtraFieldValueType>,
  ) {
    return (
      <OSLayoutModalFormField
        {...options.props}
        ref={options?.ref as React.RefObject<OSLayoutModalFormFieldAPI>}
        mode={options.mode}
        settings={options.fieldSettings}
        value={options?.value as OSLayoutModalFormFieldValueType}
        text={options?.text as OSLayoutModalFormFieldValueType}
        requests={options.requests}
      />
    );
  },
  // eslint-disable-next-line func-names
  'layout-tabs-form': function <ExtraFieldValueType = OSFieldValueType>(
    options: RenderFieldOptions<ExtraFieldValueType>,
  ) {
    return (
      <OSLayoutTabsFormField
        {...options.props}
        ref={options?.ref as React.RefObject<OSLayoutTabsFormFieldAPI>}
        mode={options.mode}
        settings={options.fieldSettings}
        value={options?.value as OSLayoutTabsFormFieldValueType}
        text={options?.text as OSLayoutTabsFormFieldValueType}
        requests={options.requests}
      />
    );
  },
  form<ExtraFieldValueType = OSFieldValueType>(options: RenderFieldOptions<ExtraFieldValueType>) {
    return (
      <OSFormField
        {...options.props}
        ref={options?.ref as React.RefObject<OSFormFieldAPI>}
        mode={options.mode}
        settings={options.fieldSettings}
        value={options?.value as OSFormFieldValueType}
        text={options?.text as OSFormFieldValueType}
        requests={options.requests}
      />
    );
  },
};

export const OSReferencesGlobalContext = React.createContext<
  React.RefObject<OSReferencesCollectorType<typeof globalRefKeys>>
>(React.createRef());

const OSProviderWrapper = (
  props: PropsWithChildren<{
    size?: SizeType;
  }>,
) => {
  const { refKeys, refsRef } = useRefsRef(globalRefKeys);

  return (
    <OSConfigProviderWrapper size={props.size}>
      <ExtraValueTypesContext.Provider value={valueTypes}>
        <OSReferencesGlobalContext.Provider value={refsRef}>
          <OSReferencesCollectorProviderWrapper ref={refsRef}>
            <OSDialog type="message" refKey={refKeys.dialogs.messages.globalMessage}>
              {props.children}
            </OSDialog>
          </OSReferencesCollectorProviderWrapper>
        </OSReferencesGlobalContext.Provider>
      </ExtraValueTypesContext.Provider>
    </OSConfigProviderWrapper>
  );
};

export default OSProviderWrapper;

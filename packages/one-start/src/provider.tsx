import { OSDialog } from '@ty-one-start/dialogs';
import { OSFormField, OSLayoutModalFormField, OSLayoutTabsFormField } from '@ty-one-start/forms';
import {
  ExtraValueTypesContext,
  OSConfigProviderWrapper,
  OSReferencesCollectorProviderWrapper,
  useRefsRef,
  globalRefKeys,
  OSReferencesGlobalContext,
} from '@ty-one-start/provider';
import { OSAttachmentTableField, OSEditableTableField } from '@ty-one-start/tables';
import type {
  CustomFieldValueTypeOptions,
  OSAttachmentTableFieldAPI,
  OSAttachmentTableFieldValueType,
  OSEditableTableFieldAPI,
  OSEditableTableFieldValueType,
  OSFieldValueType,
  OSFormFieldAPI,
  OSFormFieldValueType,
  OSLayoutModalFormFieldAPI,
  OSLayoutModalFormFieldValueType,
  OSLayoutTabsFormFieldAPI,
  OSLayoutTabsFormFieldValueType,
} from '@ty-one-start/typings';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { PropsWithChildren } from 'react';
import React from 'react';

const valueTypes = {
  // eslint-disable-next-line func-names
  'editable-table': function <ExtraFieldValueType = OSFieldValueType>(
    options: CustomFieldValueTypeOptions<ExtraFieldValueType>,
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
    options: CustomFieldValueTypeOptions<ExtraFieldValueType>,
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
    options: CustomFieldValueTypeOptions<ExtraFieldValueType>,
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
    options: CustomFieldValueTypeOptions<ExtraFieldValueType>,
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
  form<ExtraFieldValueType = OSFieldValueType>(
    options: CustomFieldValueTypeOptions<ExtraFieldValueType>,
  ) {
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

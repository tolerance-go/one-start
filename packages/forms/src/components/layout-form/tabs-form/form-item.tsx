import type { OSFormAPI, OSFormType } from '@ty-one-start/typings';
import React, { useMemo } from 'react';
import OSForm from '../../form';
import { LayoutTabsFormTabMetaContext } from '../layout-form-event-context';

export const FormItem = ({
  formKey,
  formRef,
  formConfigs,
}: {
  formKey: string;
  formRef: React.RefObject<OSFormAPI>;
  formConfigs?: OSFormType;
}) => {
  const meta = useMemo(
    () => ({
      formKey,
    }),
    [formKey],
  );

  return (
    <LayoutTabsFormTabMetaContext.Provider value={meta}>
      <OSForm name={formKey} ref={formRef} {...formConfigs}></OSForm>
    </LayoutTabsFormTabMetaContext.Provider>
  );
};

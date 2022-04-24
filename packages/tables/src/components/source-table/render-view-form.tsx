import React from 'react';
import type { OSFormType, OSSourceTableType, OSTableAPI, RecordType } from '@ty-one-start/typings';
import { OSForm } from '@ty-one-start/forms';
import { normalizeRequestOutputs } from '@ty-one-start/utils';

export const renderViewForm = ({
  rowData,
  rowIndex,
  rowId,
  actions,
  formSettings,
  rowViewable,
  requestViewRowData,
}: {
  rowData: RecordType;
  rowIndex: number;
  rowId: string;
  actions: OSTableAPI;
  formSettings?: OSFormType['settings'];
  rowViewable?: Required<OSSourceTableType>['settings']['rowViewable'];
  requestViewRowData?: Required<OSSourceTableType>['requests']['requestViewRowData'];
}) => {
  if (!rowViewable) return null;

  const requestViewRowDataFn = async (options: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: OSTableAPI;
  }) => {
    if (!requestViewRowData) return false;

    return await requestViewRowData(options).then(normalizeRequestOutputs);
  };

  return (
    <OSForm
      settings={{
        ...formSettings,
        fieldItemSettings: {
          ...formSettings?.fieldItemSettings,
          readonly: true,
        },
      }}
      requests={{
        requestDataSource: () =>
          requestViewRowDataFn({
            rowData,
            rowIndex,
            rowId,
            actions,
          }),
      }}
    />
  );
};

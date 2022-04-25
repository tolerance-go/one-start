import { message } from 'antd';
import React from 'react';
import type {
  OSDialogDrawerAPI,
  OSFormAPI,
  OSFormType,
  OSLayoutFormAPI,
  OSLayoutStepsFormType,
  OSSourceTableType,
  OSTableAPI,
  OSTriggerAPI,
  RecordType,
} from '@ty-one-start/typings';
import { OSDialog } from '@ty-one-start/dialogs';
import { OSForm } from '@ty-one-start/forms';
import { OSLayoutForm } from '@ty-one-start/forms';
import { OSTrigger } from '@ty-one-start/triggers';
import { normalizeRequestOutputs } from '@ty-one-start/utils';

export const renderEditForm = (options: {
  rowData: RecordType;
  rowIndex: number;
  rowId: string;
  actions: OSTableAPI;
  editDrawerDialogRef?: React.RefObject<OSDialogDrawerAPI>;
  formSettings?: OSFormType['settings'] | OSLayoutStepsFormType['settings'];
  formRequests?: OSFormType['requests'] | OSLayoutStepsFormType['requests'];
  formType?: 'form' | 'steps-form';
  rowEditable?: Required<OSSourceTableType>['settings']['rowEditable'];
  requestRowEditData?: Required<OSSourceTableType>['requests']['requestRowEditData'];
  requestSaveRowData?: Required<OSSourceTableType>['requests']['requestSaveRowData'];
}) => {
  const {
    editDrawerDialogRef,
    rowEditable,
    requestRowEditData,
    requestSaveRowData,
    rowData,
    rowIndex,
    rowId,
    actions,
  } = options;
  if (!rowEditable) return {};

  const editFormRef = React.createRef<OSFormAPI | OSLayoutFormAPI>();
  const saveButtonTriggerRef = React.createRef<OSTriggerAPI>();
  const resetButtonTriggerRef = React.createRef<OSTriggerAPI>();

  const requestRowEditDataFn = async () => {
    if (!requestRowEditData) return false;

    const requestRowEditDataParams = {
      rowData,
      rowIndex,
      rowId,
      actions,
    };

    const { error, data } = await requestRowEditData(requestRowEditDataParams).then(
      normalizeRequestOutputs,
    );

    return { error, data };
  };

  const requestSaveRowDataFn = async (values: RecordType) => {
    if (!requestSaveRowData) return false;

    const requestSaveRowDataParams = {
      rowData,
      rowIndex,
      rowId,
      actions,
      values,
    };

    const { error, data } = await requestSaveRowData(requestSaveRowDataParams).then(
      normalizeRequestOutputs,
    );

    if (!error) {
      message.success(data?.message ?? '保存行数据成功');
    }

    return error;
  };

  const handleSaveForm = async () => {
    if (!editFormRef.current) return false;

    const data = await editFormRef.current?.getDataSource();

    const saveError = await requestSaveRowDataFn(data as RecordType);

    if (!saveError) {
      editDrawerDialogRef?.current?.pop();
      options.actions.reload();
    }

    return saveError;
  };

  const editFormDom = (() => {
    if (options.formType === 'steps-form') {
      return (
        <OSLayoutForm
          ref={editFormRef}
          type="steps-form"
          settings={{
            ...options.formSettings,
            submitTriggerText: '确认保存',
          }}
          requests={{
            ...options.formRequests,
            requestInitialValues: () => requestRowEditDataFn(),
            requestWhenSubmit: async () => {
              return handleSaveForm();
            },
          }}
        />
      );
    }

    return (
      <OSForm
        ref={editFormRef as React.MutableRefObject<OSFormAPI>}
        settings={options.formSettings as OSFormType['settings']}
        requests={{
          ...options.formRequests,
          requestInitialValues: () => requestRowEditDataFn(),
        }}
      />
    );
  })();

  const saveButtonDom = (
    <OSDialog
      type="popconfirm"
      settings={{
        title: '确认修改吗？',
        placement: 'topRight',
      }}
      requests={{
        requestAfterConfirm: async () => {
          return handleSaveForm();
        },
      }}
    >
      <OSTrigger
        ref={saveButtonTriggerRef}
        type="button"
        settings={{
          type: 'primary',
          text: '保存',
        }}
        requests={{
          requestAfterClick: async () => {
            if (!editFormRef.current) return false;
            const { error } = await editFormRef.current?.validate();

            return error;
          },
        }}
      ></OSTrigger>
    </OSDialog>
  );

  const resetButtonDom = (
    <OSTrigger
      ref={resetButtonTriggerRef}
      type="button"
      settings={{
        text: '重置',
      }}
      onClick={() => {
        editFormRef.current?.resetFields();
      }}
    ></OSTrigger>
  );

  return {
    editFormDom,
    saveButtonDom,
    resetButtonDom,
  };
};

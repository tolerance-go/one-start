import { Col, message, Row } from 'antd';
import React from 'react';
import type {
  OSDialogDrawerAPI,
  OSFormType,
  OSLayoutStepsFormType,
  OSTableAPI,
  OSTriggerType,
  RecordType,
  OSSourceTableType,
} from '@ty-one-start/typings';
import { OSDialog } from '@ty-one-start/dialogs';
import { OSTrigger } from '@ty-one-start/triggers';
import { renderViewForm } from '../render-view-form';
import { normalizeRequestOutputs } from '@ty-one-start/utils';
import type { RowMeta } from '../typings';
import { renderEditForm } from '../render-edit-form';

export const renderRowActions =
  ({
    panelable,
    rowActions,
    rowViewable,
    rowEditable,
    rowRemoveable,
    requestRemoveRow,
    requestViewRowData,
    setActiveMeta,
    requestSaveRowData,
    requestRowEditData,
    rowTagKey,
  }: {
    panelable?: Required<OSSourceTableType>['settings']['panelable'];
    rowActions?: Required<OSSourceTableType>['settings']['rowActions'];
    rowViewable?: Required<OSSourceTableType>['settings']['rowViewable'];
    rowEditable?: Required<OSSourceTableType>['settings']['rowEditable'];
    rowRemoveable?: Required<OSSourceTableType>['settings']['rowRemoveable'];
    rowTagKey?: string;
    requestRemoveRow?: Required<OSSourceTableType>['requests']['requestRemoveRow'];
    requestViewRowData?: Required<OSSourceTableType>['requests']['requestViewRowData'];
    requestRowEditData?: Required<OSSourceTableType>['requests']['requestRowEditData'];
    requestSaveRowData?: Required<OSSourceTableType>['requests']['requestSaveRowData'];
    setActiveMeta?: React.Dispatch<React.SetStateAction<RowMeta | undefined>>;
  }) =>
  ({
    rowData,
    rowId,
    rowIndex,
    actions,
  }: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: OSTableAPI;
  }) => {
    const editDrawerDialogRef = React.createRef<OSDialogDrawerAPI>();
    const viewDrawerDialogRef = React.createRef<OSDialogDrawerAPI>();

    const manualPush = !!panelable;

    const renderUserRowActions = () => {
      const _render = () => {
        if (typeof rowActions === 'function') {
          return rowActions?.({
            rowData,
            rowId,
            rowIndex,
            actions,
          });
        }
        if (Array.isArray(rowActions)) {
          return rowActions;
        }

        if (typeof rowActions === 'object') {
          return (
            rowActions.render?.({
              rowData,
              rowId,
              rowIndex,
              actions,
            }) ?? []
          );
        }
        return [];
      };

      return _render() ?? [];
    };

    const requestRemoveRowFn = async () => {
      if (!requestRemoveRow) return false;

      const requestRemoveRowParams = {
        rowData,
        rowIndex,
        rowId,
        actions,
      };

      const { error, data } = await requestRemoveRow(requestRemoveRowParams).then(
        normalizeRequestOutputs,
      );

      if (!error) {
        message.success(data?.message ?? '?????????????????????');

        /** ?????????????????????????????????1 ???????????????????????? */

        const current = actions.getPagination()?.current ?? 0;

        if (actions.getOriginDataSource()?.length === 1 && current > 1) {
          actions.reload({
            current: current - 1,
          });
        } else {
          actions.reload();
        }
      }

      return error;
    };

    const renderViewTrigger = () => {
      if (rowViewable) {
        const renderTrigger = ({
          modalTitle,
          modalMask,
          modalWidth,
          formSettings,
          triggerSettings,
        }: {
          modalTitle?: string;
          modalMask?: boolean | 'transparent';
          modalWidth?: string | number;
          formSettings?: OSFormType['settings'];
          triggerSettings?: OSTriggerType['settings'];
        }) => {
          return (
            <OSDialog
              ref={viewDrawerDialogRef}
              type="drawer"
              settings={{
                modalMask,
                title: modalTitle ?? '????????????',
                width: modalWidth ?? '80%',
                body: renderViewForm({
                  rowData,
                  rowId,
                  rowIndex,
                  actions,
                  formSettings,
                  rowViewable,
                  requestViewRowData,
                }),
              }}
            >
              <OSTrigger
                type="button"
                settings={{
                  type: 'link',
                  text: '??????',
                  size: 'small',
                  ...triggerSettings,
                  manualPush,
                }}
                onClick={() => {
                  if (panelable) {
                    setActiveMeta?.({
                      rowData,
                      rowId,
                      rowIndex,
                      actions,
                      type: 'view',
                    });
                  }
                }}
              ></OSTrigger>
            </OSDialog>
          );
        };

        if (typeof rowViewable === 'function') {
          const options = rowViewable({
            rowData,
            rowId,
            rowIndex,
            actions,
          });
          return renderTrigger(options);
        }

        return renderTrigger(rowViewable);
      }

      return null;
    };

    const renderEditTrigger = () => {
      if (rowEditable) {
        const renderTrigger = ({
          formSettings,
          formRequests,
          formType,
          triggerSettings,
          modalWidth,
        }: {
          modalWidth?: string | number;
          triggerSettings?: OSTriggerType['settings'];
          formSettings?: OSFormType['settings'] | OSLayoutStepsFormType['settings'];
          formRequests?: OSFormType['requests'] | OSLayoutStepsFormType['requests'];
          formType: 'form' | 'steps-form';
        }) => {
          const { editFormDom, saveButtonDom, resetButtonDom } = renderEditForm({
            rowData,
            rowId,
            rowIndex,
            actions,
            editDrawerDialogRef,
            formSettings,
            formRequests,
            formType,
            rowEditable,
            requestRowEditData,
            requestSaveRowData,
          });

          return (
            <OSDialog
              ref={editDrawerDialogRef}
              type="modal"
              settings={{
                title: `????????????${rowData[rowTagKey ?? ''] ? `(${rowData[rowTagKey ?? '']})` : ''}`,
                width: modalWidth ?? '70%',
                body: editFormDom,
                footer:
                  formType === 'steps-form' ? (
                    false
                  ) : (
                    <Row justify="end" gutter={5}>
                      <Col>{resetButtonDom}</Col>
                      <Col>{saveButtonDom}</Col>
                    </Row>
                  ),
              }}
            >
              <OSTrigger
                type="button"
                settings={{
                  type: 'link',
                  text: '??????',
                  size: 'small',
                  ...triggerSettings,
                  manualPush,
                }}
                onClick={() => {
                  if (panelable) {
                    setActiveMeta?.({
                      rowData,
                      rowId,
                      rowIndex,
                      actions,
                      type: 'edit',
                    });
                  }
                }}
              ></OSTrigger>
            </OSDialog>
          );
        };

        if (typeof rowEditable === 'function') {
          const { triggerSettings, modalWidth, formSettings, formRequests, formType } = rowEditable(
            {
              rowData,
              rowId,
              rowIndex,
              actions,
            },
          );
          return renderTrigger({
            triggerSettings,
            formSettings,
            formRequests,
            formType,
            modalWidth,
          });
        }

        return renderTrigger(rowEditable);
      }

      return null;
    };

    const renderRemoveTrigger = () => {
      if (rowRemoveable) {
        const renderTrigger = (settingsWithTrigger?: OSTriggerType['settings']) => {
          return (
            <OSDialog
              type="popconfirm"
              settings={{
                title: '??????????????????????????????',
              }}
              requests={{
                requestAfterConfirm: () => requestRemoveRowFn(),
              }}
            >
              <OSTrigger
                type="button"
                settings={{
                  type: 'link',
                  text: '??????',
                  size: 'small',
                  danger: true,
                  ...settingsWithTrigger,
                }}
              ></OSTrigger>
            </OSDialog>
          );
        };

        if (typeof rowRemoveable === 'function') {
          const { triggerSettings } = rowRemoveable({
            rowData,
            rowId,
            rowIndex,
            actions,
          });
          return renderTrigger(triggerSettings);
        }

        return renderTrigger(rowRemoveable.triggerSettings);
      }

      return null;
    };

    return [
      ...renderUserRowActions(),
      renderViewTrigger(),
      renderEditTrigger(),
      renderRemoveTrigger(),
    ];
  };

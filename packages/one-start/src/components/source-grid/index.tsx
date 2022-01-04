import { Col, Row } from '@ty/antd';
import React, { useContext, useState, useImperativeHandle, useRef } from 'react';
import OSDialog from '../dialog';
import OSForm from '../form';
import { OSReferencesGlobalContext } from '../providers/provider';
import OSGrid from '../grid';
import OSEmpty from '../table/components/empty';
import OSTrigger from '../trigger';
import type {
  OSDialogDrawerAPI,
  OSFormAPI,
  OSSourceGridAPI,
  OSSourceGridType,
  OSGridAPI,
  OSTriggerAPI,
  RecordType,
  OSGridType,
} from '../typings';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { useClsPrefix } from '../utils/use-cls-prefix';
import type { RequiredRecursion } from '../utils/typings';

const OSSourceGrid: React.ForwardRefRenderFunction<OSSourceGridAPI, OSSourceGridType> = (
  props,
  ref,
) => {
  const { settings, requests } = props;
  const {
    rowRemoveable,
    rowViewable,
    rowEditable,
    rowActions,
    panelable,
    rowActionsColWidth,
    defaultActiveFirstRow,
  } = settings ?? {};
  const clsPrefix = useClsPrefix('source-table');

  const globalRefsRef = useContext(OSReferencesGlobalContext);

  type RowMeta = {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: OSGridAPI;
    type: 'edit' | 'view';
  };

  const [activeMeta, setActiveMeta] = useState<RowMeta>();

  const tableRef = useRef<OSGridAPI>(null);

  useImperativeHandle(ref, () => ({
    ...tableRef.current!,
  }));

  const requestRemoveRow = async (options: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: OSGridAPI;
  }) => {
    if (!requests?.requestRemoveRow) return false;

    const { error, data } = await requests.requestRemoveRow(options).then(normalizeRequestOutputs);

    if (!error) {
      globalRefsRef.current?.dialogs?.messages?.globalMessage?.push({
        title: data?.message ?? '删除行数据成功',
      });
      options.actions.reload();
    }

    return error;
  };

  const requestViewRowData = async (options: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: OSGridAPI;
  }) => {
    if (!requests?.requestViewRowData) return false;

    const { error, data } = await requests
      .requestViewRowData(options)
      .then(normalizeRequestOutputs);

    return { error, data };
  };

  const requestRowEditData = async (options: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: OSGridAPI;
    saveButtonTriggerRef: React.RefObject<OSTriggerAPI>;
    resetButtonTriggerRef: React.RefObject<OSTriggerAPI>;
  }) => {
    if (!requests?.requestRowEditData) return false;

    const { saveButtonTriggerRef, resetButtonTriggerRef, ...params } = options;

    saveButtonTriggerRef.current?.update({ disabled: true });
    resetButtonTriggerRef.current?.update({ disabled: true });
    const { error, data } = await requests.requestRowEditData(params).then(normalizeRequestOutputs);
    saveButtonTriggerRef.current?.update({ disabled: false });
    resetButtonTriggerRef.current?.update({ disabled: false });

    return { error, data };
  };

  const requestSaveRowData = async (options: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: OSGridAPI;
    values: RecordType;
  }) => {
    if (!requests?.requestSaveRowData) return false;

    const { ...params } = options;

    const { error, data } = await requests.requestSaveRowData(params).then(normalizeRequestOutputs);

    if (!error) {
      globalRefsRef.current?.dialogs?.messages?.globalMessage?.push({
        title: data?.message ?? '保存行数据成功',
      });
    }

    return error;
  };

  const renderViewForm = (options: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: OSGridAPI;
  }) => {
    if (!rowViewable) return null;

    return (
      <OSForm
        settings={{
          ...rowViewable.formSettings,
          fieldItemSettings: {
            ...rowViewable.formSettings?.fieldItemSettings,
            readonly: true,
          },
        }}
        requests={{
          requestDataSource: () => requestViewRowData(options),
        }}
      />
    );
  };

  const renderEditForm = (options: {
    rowData: RecordType;
    rowIndex: number;
    rowId: string;
    actions: OSGridAPI;
    editDrawerDialogRef?: React.RefObject<OSDialogDrawerAPI>;
  }) => {
    if (!rowEditable) return {};

    const editFormRef = React.createRef<OSFormAPI>();
    const saveButtonTriggerRef = React.createRef<OSTriggerAPI>();
    const resetButtonTriggerRef = React.createRef<OSTriggerAPI>();

    const { editDrawerDialogRef, ...params } = options;

    const editFormDom = (
      <OSForm
        ref={editFormRef}
        settings={rowEditable.formSettings}
        requests={{
          requestInitialValues: () =>
            requestRowEditData({
              ...params,
              saveButtonTriggerRef,
              resetButtonTriggerRef,
            }),
        }}
      />
    );

    const saveButtonDom = (
      <OSDialog
        type="popconfirm"
        settings={{
          title: '确认修改吗？',
          placement: 'topRight',
        }}
        requests={{
          requestAfterConfirm: async () => {
            if (!editFormRef.current) return false;

            const data = await editFormRef.current?.getDataSource();

            const saveError = await requestSaveRowData({
              values: data as RecordType,
              ...params,
            });

            if (!saveError) {
              editDrawerDialogRef?.current?.pop();
              options.actions.reload();
            }

            return saveError;
          },
        }}
      >
        <OSTrigger
          ref={saveButtonTriggerRef}
          type="button"
          settings={{
            type: 'primary',
            text: '保存',
            initialDisabled: true,
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
          initialDisabled: true,
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

  const requestTableDataSource: RequiredRecursion<OSGridType>['requests']['requestDataSource'] =
    async (params) => {
      const result = await props.requests
        ?.requestDataSource?.(params)
        .then(normalizeRequestOutputs);
      if (defaultActiveFirstRow && !result?.error) {
        const rowData = result?.data?.page?.[0] ?? {};
        const firstRowMeta = {
          rowData,
          rowIndex: 0,
          rowId: rowData.id,
          actions: tableRef.current!,
          type: defaultActiveFirstRow.type ?? 'edit',
        };
        setActiveMeta(firstRowMeta);
      }
      return result;
    };

  const tableListDom = (
    <OSGrid
      {...props}
      ref={tableRef}
      settings={{
        ...props.settings,
        rowActions:
          rowViewable || rowEditable || rowRemoveable
            ? {
                width: rowActionsColWidth ?? 150,
                render: ({ rowData, rowId, rowIndex, actions }) => {
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
                        return rowActions.render({
                          rowData,
                          rowId,
                          rowIndex,
                          actions,
                        });
                      }
                      return [];
                    };

                    return _render() ?? [];
                  };

                  return [
                    ...renderUserRowActions(),
                    rowViewable ? (
                      <OSDialog
                        ref={viewDrawerDialogRef}
                        type="drawer"
                        settings={{
                          title: '详情展示',
                          width: '70%',
                          body: renderViewForm({ rowData, rowId, rowIndex, actions }),
                        }}
                      >
                        <OSTrigger
                          type="button"
                          settings={{
                            type: 'link',
                            text: '详情',
                            manualPush,
                          }}
                          onClick={() => {
                            if (panelable) {
                              setActiveMeta({ rowData, rowId, rowIndex, actions, type: 'view' });
                            }
                          }}
                        ></OSTrigger>
                      </OSDialog>
                    ) : null,
                    rowEditable
                      ? (() => {
                          const { editFormDom, saveButtonDom, resetButtonDom } = renderEditForm({
                            rowData,
                            rowId,
                            rowIndex,
                            actions,
                            editDrawerDialogRef,
                          });

                          return (
                            <OSDialog
                              ref={editDrawerDialogRef}
                              type="modal"
                              settings={{
                                title: `编辑数据${
                                  rowData[props.settings?.rowTagKey ?? '']
                                    ? `(${rowData[props.settings?.rowTagKey ?? '']})`
                                    : ''
                                }`,
                                width: rowEditable.modalWidth ?? '70%',
                                body: editFormDom,
                                footer: (
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
                                  text: '编辑',
                                  manualPush,
                                }}
                                onClick={() => {
                                  if (panelable) {
                                    setActiveMeta({
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
                        })()
                      : null,
                    rowRemoveable ? (
                      <OSDialog
                        type="popconfirm"
                        settings={{
                          title: '确认删除此行数据吗？',
                        }}
                        requests={{
                          requestAfterConfirm: () =>
                            requestRemoveRow({
                              rowData,
                              rowId,
                              rowIndex,
                              actions,
                            }),
                        }}
                      >
                        <OSTrigger
                          type="button"
                          settings={{
                            type: 'link',
                            text: '删除',
                            danger: true,
                          }}
                        ></OSTrigger>
                      </OSDialog>
                    ) : null,
                  ];
                },
              }
            : props.settings?.rowActions,
      }}
      requests={{
        ...props.requests,
        requestDataSource: requestTableDataSource,
      }}
    ></OSGrid>
  );

  if (panelable) {
    const renderPanelView = () => {
      if (!activeMeta) return null;

      const { type: metaType, ...params } = activeMeta;

      if (metaType === 'view') {
        return renderViewForm(params);
      }

      if (metaType === 'edit') {
        const { editFormDom, saveButtonDom, resetButtonDom } = renderEditForm(params);

        return (
          <Row
            style={{
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Col flex="auto">{editFormDom}</Col>
            <Col flex={'none'}>
              <Row justify="end" gutter={5}>
                <Col>{resetButtonDom}</Col>
                <Col>{saveButtonDom}</Col>
              </Row>
            </Col>
          </Row>
        );
      }

      return null;
    };

    const tableSpan = panelable.tableSpan ?? 10;

    return (
      <Row gutter={10}>
        <Col span={tableSpan}>{tableListDom}</Col>
        <Col className={`${clsPrefix}-panel`} span={24 - tableSpan}>
          {activeMeta ? (
            <div style={{ height: '100%' }} key={`${activeMeta.rowId}_${activeMeta.type}`}>
              {renderPanelView()}
            </div>
          ) : (
            <OSEmpty style={{ margin: 0 }} />
          )}
        </Col>
      </Row>
    );
  }

  return tableListDom;
};

export default React.forwardRef(OSSourceGrid);
export const Settings: React.FC<OSSourceGridType['settings']> = () => <></>;
export const Requests: React.FC<OSSourceGridType['requests']> = () => <></>;

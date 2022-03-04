import { Col, Row, Space } from '@ty/antd';
import utl from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import type {
  OSDialogAPI,
  OSFormAPI,
  OSFormType,
  OSSearchTableType,
  OSSourceTableAPI,
  RequiredRecursion,
} from '../../typings';
import OSDialog from '../dialog';
import OSForm from '../form';
import OSSourceTable from '../source-table';
import { eventNames } from '../table/constants';
import OSTrigger from '../trigger';
import { logRequestMessage } from '../utils/log-request-message';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';

export const useSearchTemplate = ({
  requestUpdateSearchTempldate,
  requestApplayTemplateSearchValues,
  requestCreateTemplate,
  requestTemplateDataSource,
  requestRemoveTemplate,
  requestRowEditTemplate,
  requestSaveRowTemplate,
  editFormFieldItems,
  templateManagementTableFieldItems,
  createFormFieldItems,
  templateNameKey,
  sourceTableRef,
  enable,
  canYouCreateOrUpdate,
  afterChangeApplyedSnapshot,
  afterUpdateSnapshotSuccess,
}: {
  /** 当视图更新成功后 */
  afterUpdateSnapshotSuccess?: () => void;
  /** 当切换应用的视图快照后 */
  afterChangeApplyedSnapshot?: () => void;
  canYouCreateOrUpdate: boolean;
  templateManagementTableFieldItems?: RequiredRecursion<OSSearchTableType>['settings']['fieldItems'];
  createFormFieldItems?: RequiredRecursion<OSFormType>['settings']['fieldItems'];
  editFormFieldItems?: RequiredRecursion<OSFormType>['settings']['fieldItems'];
  requestUpdateSearchTempldate?: RequiredRecursion<OSSearchTableType>['requests']['requestUpdateSearchTempldate'];
  requestSaveRowTemplate?: RequiredRecursion<OSSearchTableType>['requests']['requestSaveRowTemplate'];
  requestApplayTemplateSearchValues?: RequiredRecursion<OSSearchTableType>['requests']['requestApplayTemplateSearchValues'];
  requestCreateTemplate?: RequiredRecursion<OSSearchTableType>['requests']['requestCreateTemplate'];
  requestTemplateDataSource?: RequiredRecursion<OSSearchTableType>['requests']['requestTemplateDataSource'];
  requestRemoveTemplate?: RequiredRecursion<OSSearchTableType>['requests']['requestRemoveTemplate'];
  requestRowEditTemplate?: RequiredRecursion<OSSearchTableType>['requests']['requestRowEditTemplate'];
  templateNameKey?: string;
  sourceTableRef: React.MutableRefObject<OSSourceTableAPI | null>;
  enable?: boolean;
}) => {
  /** 当前应用视图 id */
  const [currentTplId, setCurrentTplId] = useState<string>();
  const [currentTplName, setCurrentTplName] = useState<string>();
  const managementDialogRef = useRef<OSDialogAPI>(null);

  /** 应用新的模板 */
  const applyTemplate = (tplId: string, tplName?: string) => {
    setCurrentTplId(tplId);
    setCurrentTplName(tplName ?? tplId);
    afterChangeApplyedSnapshot?.();
  };

  const inlineLeadingAPIRef = useActionsRef({
    applyTemplate,
    afterUpdateSnapshotSuccess,
  });

  const getCreateDialogWrapper = (options: { contentElement: React.ReactElement }) => {
    const formRef = React.createRef<OSFormAPI>();
    const createDialogRef = React.createRef<OSDialogAPI>();

    return (
      <OSDialog
        ref={createDialogRef}
        type="modal"
        settings={{
          width: 500,
          title: currentTplId ? '视图另存为' : '创建视图',
          body: (
            <OSForm
              ref={formRef}
              settings={{
                fieldItemSettings: {
                  labelCol: {
                    span: 6,
                  },
                  wrapperCol: {
                    span: 18,
                  },
                },
                fieldItems: createFormFieldItems,
              }}
            />
          ),
          footer: (
            <Row justify="end" gutter={5}>
              <Col>
                <OSTrigger
                  type="button"
                  settings={{
                    text: '重置',
                  }}
                  onClick={() => formRef.current?.resetFields()}
                />
              </Col>
              <Col>
                <OSTrigger
                  type="button"
                  settings={{
                    type: 'primary',
                    text: '创建',
                  }}
                  requests={{
                    requestAfterClick: async () => {
                      if (!requestCreateTemplate) return false;
                      const result = await formRef.current?.validate();
                      if (!result || result.error) return false;
                      const { error, data } = await requestCreateTemplate({
                        values: result.data,
                        searchDataSource: sourceTableRef.current?.getSearchFormDataSource(),
                        columnsVisibleMap: sourceTableRef.current?.getColumnsSettingsVisibleMap(),
                        columnsFixedsMap: sourceTableRef.current?.getColumnsSettingsFixedMap(),
                        columnsOrders: sourceTableRef.current?.getColumnsSettingsOrders(),
                      })
                        .then(normalizeRequestOutputs)
                        .then(logRequestMessage(`${currentTplId ? '更新' : '创建'}视图成功`));

                      if (!error) {
                        createDialogRef.current?.pop();

                        if (data?.tplId) {
                          inlineLeadingAPIRef.current.applyTemplate(data?.tplId, data?.tplName);
                        }
                      }

                      return error;
                    },
                  }}
                />
              </Col>
            </Row>
          ),
        }}
      >
        {options.contentElement}
      </OSDialog>
    );
  };

  const inlineAPIRef = useActionsRef({
    applyTemplate,
    afterUpdateSnapshotSuccess,
    getCreateDialogWrapper,
  });

  const updateMenuDom = useMemo(() => {
    if (currentTplId == null) {
      return null;
    }
    return (
      <OSTrigger
        type="dropdown"
        settings={{
          split: true,
          text: '更新视图',
          disabled: !canYouCreateOrUpdate,
          badge: currentTplId
            ? {
                type: 'ribbon',
                settings: {
                  text: currentTplName,
                },
              }
            : {
                type: 'ribbon',
                settings: {
                  text: '默认视图',
                },
              },
          badgeWrapperStyle: {
            marginRight: 7,
          },
          menu: [
            {
              text: inlineAPIRef.current.getCreateDialogWrapper({
                contentElement: (
                  <OSTrigger
                    type="button"
                    settings={{
                      text: '另存视图为',
                      plain: true,
                      type: 'text',
                      block: true,
                    }}
                  />
                ),
              }),
              key: 'saveAs',
            },
          ],
        }}
        requests={{
          requestAfterClick: async () => {
            if (!requestUpdateSearchTempldate) return false;
            const { error } = await requestUpdateSearchTempldate?.({
              id: currentTplId,
              searchValues: sourceTableRef.current?.getSearchFormDataSource(),
              columnsVisibleMap: sourceTableRef.current?.getColumnsSettingsVisibleMap(),
              columnsFixedsMap: sourceTableRef.current?.getColumnsSettingsFixedMap(),
              columnsOrders: sourceTableRef.current?.getColumnsSettingsOrders(),
            })
              .then(normalizeRequestOutputs)
              .then(logRequestMessage('视图更新成功'));

            if (!error) {
              inlineAPIRef.current.afterUpdateSnapshotSuccess?.();
            }

            return error;
          },
        }}
      />
    );
  }, [
    currentTplId,
    canYouCreateOrUpdate,
    currentTplName,
    requestUpdateSearchTempldate,
    sourceTableRef,
    inlineAPIRef,
  ]);

  const tplManagementDom = useMemo(() => {
    return (
      <OSDialog
        type="modal"
        ref={managementDialogRef}
        settings={{
          title: '视图管理',
          width: 800,
          body: (
            <OSSourceTable
              settings={{
                rowEditable: {
                  formType: 'form',
                  modalWidth: 500,
                  formSettings: {
                    fieldItemSettings: {
                      labelCol: {
                        span: 6,
                      },
                      wrapperCol: {
                        span: 18,
                      },
                    },
                    fieldItems: editFormFieldItems,
                  },
                },
                rowRemoveable: {},
                fieldItems: templateManagementTableFieldItems,
                rowActions: ({ rowId, rowData }) => [
                  <OSTrigger
                    type="button"
                    settings={{
                      type: 'link',
                      text: '应用',
                      size: 'small',
                    }}
                    requests={{
                      requestAfterClick: async () => {
                        if (!requestApplayTemplateSearchValues) return false;
                        const { error, data } = await requestApplayTemplateSearchValues?.({
                          id: rowId,
                        })
                          .then(normalizeRequestOutputs)
                          .then(logRequestMessage('应用视图数据成功'));

                        if (!error) {
                          if (data?.searchDataSource) {
                            sourceTableRef.current?.resetSearchFormValues();
                            sourceTableRef.current?.setSearchFormCurrentValues(
                              data?.searchDataSource,
                            );
                          }
                          sourceTableRef.current?.setColumnsSettingsVisibleMap(
                            data?.columnsVisibleMap,
                          );

                          sourceTableRef.current?.setColumnsSettingsOrders(data?.columnsOrders);

                          /** fixedMap 调用必须在最后，因为内部会改变 treeData 顺序 */
                          sourceTableRef.current?.setColumnsSettingsFixedMap(
                            data?.columnsFixedsMap,
                          );

                          sourceTableRef.current?.applyColumnSettings();

                          inlineAPIRef.current.applyTemplate(
                            rowId,
                            templateNameKey ? utl.get(rowData, templateNameKey) : null,
                          );

                          managementDialogRef.current?.pop();
                          sourceTableRef.current?.reload();
                        }

                        return error;
                      },
                    }}
                  />,
                ],
              }}
              requests={{
                requestDataSource: requestTemplateDataSource,
                requestRemoveRow: async (options) => {
                  if (!requestRemoveTemplate) return false;
                  const { error, data } = await requestRemoveTemplate?.(options).then(
                    normalizeRequestOutputs,
                  );
                  if (!error) {
                    if (options.rowId === currentTplId) {
                      setCurrentTplName(undefined);
                      setCurrentTplId(undefined);
                    }
                  }
                  return {
                    error,
                    data,
                  };
                },
                requestRowEditData: requestRowEditTemplate,
                requestSaveRowData: requestSaveRowTemplate,
              }}
            />
          ),
        }}
        destroyOnClose
      ></OSDialog>
    );
  }, [
    inlineAPIRef,
    editFormFieldItems,
    templateManagementTableFieldItems,
    requestTemplateDataSource,
    requestRowEditTemplate,
    requestSaveRowTemplate,
    requestApplayTemplateSearchValues,
    sourceTableRef,
    templateNameKey,
    requestRemoveTemplate,
    currentTplId,
  ]);

  const createOrUpdateTempldateDom = useMemo(() => {
    if (!enable) return null;
    return (
      <Space size={5}>
        {React.cloneElement(tplManagementDom, {
          children: (
            <OSTrigger
              type="button"
              settings={{
                type: 'default',
                text: '视图管理',
              }}
            ></OSTrigger>
          ),
        })}
        {currentTplId ? updateMenuDom : null}
        {currentTplId
          ? null
          : inlineAPIRef.current.getCreateDialogWrapper({
              contentElement: (
                <OSTrigger
                  type="button"
                  settings={{
                    text: '创建视图',
                    disabled: !canYouCreateOrUpdate,
                    badge: currentTplId
                      ? {
                          type: 'ribbon',
                          settings: {
                            text: currentTplName,
                          },
                        }
                      : {
                          type: 'ribbon',
                          settings: {
                            text: '默认视图',
                          },
                        },
                    badgeWrapperStyle: {
                      marginRight: 7,
                    },
                  }}
                />
              ),
            })}
      </Space>
    );
  }, [
    inlineAPIRef,
    enable,
    tplManagementDom,
    currentTplId,
    updateMenuDom,
    canYouCreateOrUpdate,
    currentTplName,
  ]);

  useEffect(() => {
    const handleReset = () => {
      setCurrentTplId(undefined);
      setCurrentTplName(undefined);
    };
    sourceTableRef.current?.core.on(eventNames.onSearchFormReset, handleReset);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sourceTableRef.current?.core.off(eventNames.onSearchFormReset, handleReset);
    };
  }, []);

  return {
    createOrUpdateTempldateDom,
  };
};

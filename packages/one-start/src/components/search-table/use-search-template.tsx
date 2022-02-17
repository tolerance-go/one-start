import { Col, Row, Typography } from '@ty/antd';
import utl from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type {
  OSDialogAPI,
  OSFormAPI,
  OSFormType,
  OSMenuItem,
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
}: {
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

  const updateMenuDom = useMemo(() => {
    if (currentTplId == null) {
      return null;
    }
    return (
      <OSTrigger
        type="button"
        settings={{
          text: (
            <Typography.Text>
              更新视图 <Typography.Text type="secondary">{currentTplName}</Typography.Text>
            </Typography.Text>
          ),
          type: 'text',
          plain: true,
          block: true,
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

            return error;
          },
        }}
      />
    );
  }, [currentTplId, requestUpdateSearchTempldate, sourceTableRef, currentTplName]);

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

                          setCurrentTplId(rowId);
                          if (templateNameKey) {
                            setCurrentTplName(utl.get(rowData, templateNameKey));
                          }
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
      >
        <OSTrigger
          type="button"
          settings={{
            text: '视图管理',
            type: 'text',
            plain: true,
            block: true,
          }}
        />
      </OSDialog>
    );
  }, [
    currentTplId,
    editFormFieldItems,
    requestApplayTemplateSearchValues,
    requestTemplateDataSource,
    sourceTableRef,
    templateManagementTableFieldItems,
    requestRemoveTemplate,
    templateNameKey,
    requestRowEditTemplate,
    requestSaveRowTemplate,
  ]);

  const createOrUpdateTempldateDom = useMemo(() => {
    if (!enable) return null;
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
                      const { error } = await requestCreateTemplate({
                        values: result.data,
                        searchDataSource: sourceTableRef.current?.getSearchFormDataSource(),
                        columnsVisibleMap: sourceTableRef.current?.getColumnsSettingsVisibleMap(),
                        columnsFixedsMap: sourceTableRef.current?.getColumnsSettingsFixedMap(),
                        columnsOrders: sourceTableRef.current?.getColumnsSettingsOrders(),
                      })
                        .then(normalizeRequestOutputs)
                        .then(logRequestMessage('创建视图成功'));

                      if (!error) {
                        createDialogRef.current?.pop();
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
        <OSTrigger
          type="dropdown"
          settings={{
            split: true,
            text: currentTplId ? '另存视图为' : '创建视图',
            // disabled: utl.isEmpty(sourceTableRef.current?.getSearchFormDataSource()),
            menu: [
              currentTplId
                ? ({
                    text: updateMenuDom,
                  } as OSMenuItem)
                : null,
              {
                text: tplManagementDom,
                key: 'management',
              },
            ].filter((item): item is OSMenuItem => !!item),
            badge: currentTplId
              ? {
                  type: 'ribbon',
                  settings: {
                    text: currentTplName,
                  },
                }
              : undefined,
            badgeWrapperStyle: currentTplId
              ? {
                  marginRight: 7,
                }
              : undefined,
          }}
        />
      </OSDialog>
    );
  }, [
    enable,
    currentTplId,
    createFormFieldItems,
    updateMenuDom,
    tplManagementDom,
    currentTplName,
    requestCreateTemplate,
    sourceTableRef,
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

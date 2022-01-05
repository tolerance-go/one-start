import { Col, Row, Typography } from '@ty/antd';
import utl from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import OSDialog from '../dialog';
import OSForm from '../form';
import OSSourceGrid from '../source-grid';
import { eventNames } from '../table/constants';
import OSTrigger from '../trigger';
import type {
  OSDialogAPI,
  OSFormAPI,
  OSFormType,
  OSMenuItem,
  OSSearchGridType,
  OSSourceGridAPI,
} from '../../typings';
import { logRequestMessage } from '../utils/log-request-message';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import type { RequiredRecursion } from '../../typings';

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
  sourceGridRef,
  enable,
}: {
  templateManagementTableFieldItems?: RequiredRecursion<OSSearchGridType>['settings']['fieldItems'];
  createFormFieldItems?: RequiredRecursion<OSFormType>['settings']['fieldItems'];
  editFormFieldItems?: RequiredRecursion<OSFormType>['settings']['fieldItems'];
  requestUpdateSearchTempldate?: RequiredRecursion<OSSearchGridType>['requests']['requestUpdateSearchTempldate'];
  requestSaveRowTemplate?: RequiredRecursion<OSSearchGridType>['requests']['requestSaveRowTemplate'];
  requestApplayTemplateSearchValues?: RequiredRecursion<OSSearchGridType>['requests']['requestApplayTemplateSearchValues'];
  requestCreateTemplate?: RequiredRecursion<OSSearchGridType>['requests']['requestCreateTemplate'];
  requestTemplateDataSource?: RequiredRecursion<OSSearchGridType>['requests']['requestTemplateDataSource'];
  requestRemoveTemplate?: RequiredRecursion<OSSearchGridType>['requests']['requestRemoveTemplate'];
  requestRowEditTemplate?: RequiredRecursion<OSSearchGridType>['requests']['requestRowEditTemplate'];
  templateNameKey?: string;
  sourceGridRef: React.MutableRefObject<OSSourceGridAPI | null>;
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
              searchValues: sourceGridRef.current?.getSearchFormDataSource(),
              columnsState: sourceGridRef.current?.gridRef.current?.columnApi
                .getColumnState()
                .map((item) => {
                  const { aggFunc, ...rest } = item;
                  return rest;
                }),
            })
              .then(normalizeRequestOutputs)
              .then(logRequestMessage('视图更新成功'));

            return error;
          },
        }}
      />
    );
  }, [currentTplId, requestUpdateSearchTempldate, sourceGridRef, currentTplName]);

  const tplManagementDom = useMemo(() => {
    return (
      <OSDialog
        type="modal"
        ref={managementDialogRef}
        settings={{
          title: '视图管理',
          width: 800,
          body: (
            <OSSourceGrid
              settings={{
                rowEditable: {
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
                            sourceGridRef.current?.resetSearchFormValues();
                            sourceGridRef.current?.setSearchFormCurrentValues(
                              data?.searchDataSource,
                            );
                          }
                          if (data?.columnsState) {
                            sourceGridRef.current?.gridRef.current?.columnApi.applyColumnState({
                              state: data?.columnsState,
                              applyOrder: true,
                            });
                          }

                          setCurrentTplId(rowId);
                          if (templateNameKey) {
                            setCurrentTplName(utl.get(rowData, templateNameKey));
                          }
                          managementDialogRef.current?.pop();
                          sourceGridRef.current?.reload();
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
    sourceGridRef,
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
                        searchDataSource: sourceGridRef.current?.getSearchFormDataSource(),
                        columnsState: sourceGridRef.current?.gridRef.current?.columnApi
                          .getColumnState()
                          .map((item) => {
                            const { aggFunc, ...rest } = item;
                            return rest;
                          }),
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
            // disabled: utl.isEmpty(sourceGridRef.current?.getSearchFormDataSource()),
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
          }}
        />
      </OSDialog>
    );
  }, [
    sourceGridRef,
    createFormFieldItems,
    currentTplId,
    enable,
    requestCreateTemplate,
    tplManagementDom,
    updateMenuDom,
  ]);

  useEffect(() => {
    const handleReset = () => {
      setCurrentTplId(undefined);
      setCurrentTplName(undefined);
    };
    sourceGridRef.current?.core.on(eventNames.onSearchFormReset, handleReset);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sourceGridRef.current?.core.off(eventNames.onSearchFormReset, handleReset);
    };
  }, []);

  return {
    createOrUpdateTempldateDom,
  };
};

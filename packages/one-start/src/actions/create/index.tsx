/* eslint-disable consistent-return */
import { Col, Row, Space } from '@ty/antd';
import React, { useMemo, useRef, useState } from 'react';
import {
  OSDialog,
  OSForm,
  globalRefKeys,
  OSTable,
  OSTrigger,
  OSReferencesCollectorProviderWrapper,
  useRefsRef,
  normalizeRequestOutputs,
} from '../../components';
import type {
  OSActionsCreateAPI,
  OSActionsCreateType,
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSDialogModalAPI,
  OSFormAPI,
  OSTableRequestDataSourceParams,
} from '../../typings';
import type { ApplyingTemplateAPI } from './applying-template';
import ApplyingTemplate from './applying-template';
import type { FormUpdateTimestampAPI } from './form-update-timestamp';
import FormUpdateTimestamp from './form-update-timestamp';

const OSActionsCreate: React.ForwardRefRenderFunction<OSActionsCreateAPI, OSActionsCreateType> = (
  props,
) => {
  const { settings, requests } = props;
  const {
    requestTemplateCreate,
    requestTemplateList,
    requestTemplateDataSource,
    requestUpdateTemplateInfo,
    requestDeleteTemplate,
    requestApplayTemplateData,
    requestUpdateTemplateValues,
  } = requests ?? {};

  const {
    templateCreateFormSettings,
    templateCreateModalSettings,
    templateSearchTableSettings,
    enablePersistence = false,
    enableTemplate = false,
  } = settings ?? {};

  const [dialogVisible, setDialogVisible] = useState(false);

  const createFormRef = useRef<OSFormAPI>(null);

  const { refKeys, refsRef } = useRefsRef({
    dialogs: {
      modals: {
        createModal: 'createModal',
        tplCreate: 'tplCreate',
        tplSettings: 'tplSettings',
      },
      messages: {
        ...globalRefKeys.dialogs.messages,
      },
      popconfirms: {
        createConfirm: 'createConfirm',
      },
    },
    tables: {
      tplSettings: 'tplSettings',
    },
    forms: {
      createForm: 'createForm',
      createTpl: 'createTpl',
      editTpl: 'editTpl',
    },
    triggers: {
      buttons: {
        saveBtn: 'saveBtn',
      },
    },
  });

  const formUpdateTimestampRef = useRef<FormUpdateTimestampAPI>(null);
  const applyingTemplateRef = useRef<ApplyingTemplateAPI>(null);

  const createFormDom = (
    <OSForm
      ref={createFormRef}
      refKey={refKeys.forms.createForm}
      settings={settings?.createFormSettings}
      onDataSourceChange={(normalizedValues) => {
        formUpdateTimestampRef.current?.updateLocalData?.(normalizedValues);
      }}
      onDataSourceLinkageChange={(normalizedValues) => {
        formUpdateTimestampRef.current?.updateLocalData?.(normalizedValues);
      }}
    ></OSForm>
  );

  const persistenceDom = useMemo(() => {
    if (enablePersistence) {
      return (
        <FormUpdateTimestamp
          dialogVisible={dialogVisible}
          ref={formUpdateTimestampRef}
          formRef={createFormRef}
          unionId={settings?.sourceId ?? window.location.pathname}
        />
      );
    }
    return null;
  }, [dialogVisible, enablePersistence, settings?.sourceId]);

  const templateSettingDom = useMemo(() => {
    return (
      <OSDialog
        type="modal"
        destroyOnClose
        refKey={refKeys.dialogs.modals.tplSettings}
        settings={{
          title: '模板设置',
          width: '40%',
          body: (
            <OSTable
              refKey={refKeys.tables.tplSettings}
              settings={{
                ...templateSearchTableSettings,
                searchFormItemChunkSize: 2,
                fieldItems: templateSearchTableSettings?.fieldItems?.concat([
                  {
                    type: 'actions',
                    settings: (params) => {
                      const tplEditModalRef = React.createRef<OSDialogModalAPI>();

                      return {
                        title: '操作',
                        dataIndex: 'actions',
                        align: 'center',
                        actions: [
                          <OSTrigger
                            type={'button'}
                            settings={{
                              text: '应用',
                              type: 'link',
                            }}
                            requests={{
                              requestAfterClick: async () => {
                                if (!requestApplayTemplateData) return;
                                const { error, data } = await requestApplayTemplateData(
                                  params,
                                ).then(normalizeRequestOutputs);
                                if (error || !data) return;

                                refsRef.current?.dialogs?.messages?.globalMessage?.push({
                                  title: '应用模板数据成功',
                                });

                                applyingTemplateRef.current?.setApplyingTemplate({
                                  id: data?.templateId,
                                  name: data?.templateName,
                                });

                                refsRef.current?.dialogs?.modals?.tplSettings?.pop();
                                refsRef.current?.forms?.createForm?.resetFields();
                                refsRef.current?.forms?.createForm?.setFieldsValue(data.values);
                              },
                            }}
                          />,
                          <OSDialog
                            type="modal"
                            ref={tplEditModalRef}
                            settings={{
                              title: '模板编辑',
                              width: 350,
                              body: (
                                <OSForm
                                  refKey={refKeys.forms.editTpl}
                                  settings={{
                                    ...templateCreateFormSettings,
                                  }}
                                  requests={{
                                    requestDataSource: async () => {
                                      if (!requestTemplateDataSource) return;
                                      refsRef.current?.triggers?.buttons?.saveBtn?.update({
                                        disabled: true,
                                      });
                                      const { error, data } = await requestTemplateDataSource(
                                        params,
                                      ).then(normalizeRequestOutputs);
                                      refsRef.current?.triggers?.buttons?.saveBtn?.update({
                                        disabled: false,
                                      });
                                      return {
                                        error,
                                        data,
                                      };
                                    },
                                  }}
                                ></OSForm>
                              ),
                              footer: (
                                <OSTrigger
                                  type="button"
                                  refKey={refKeys.triggers.buttons.saveBtn}
                                  settings={{
                                    text: '保存',
                                    type: 'primary',
                                  }}
                                  requests={{
                                    requestAfterClick: async () => {
                                      const result =
                                        await refsRef.current?.forms?.editTpl?.validate();
                                      if (!result || result?.error) return;

                                      const { data: values } = result;

                                      if (!requestUpdateTemplateInfo) return;

                                      const { error } = await requestUpdateTemplateInfo({
                                        ...params,
                                        values,
                                      }).then(normalizeRequestOutputs);

                                      if (error) {
                                        return error;
                                      }

                                      refsRef.current?.dialogs?.messages?.globalMessage?.push({
                                        title: '保存成功',
                                      });
                                      tplEditModalRef.current?.pop();
                                      refsRef.current?.tables?.tplSettings?.reload();
                                      return false;
                                    },
                                  }}
                                ></OSTrigger>
                              ),
                            }}
                          >
                            <OSTrigger
                              type="button"
                              settings={{
                                text: '编辑',
                                type: 'link',
                              }}
                            />
                          </OSDialog>,
                          <OSDialog
                            type="popconfirm"
                            settings={{
                              title: '确认删除吗？',
                            }}
                            requests={{
                              requestAfterConfirm: async () => {
                                if (!requestDeleteTemplate) return;
                                const { error } = await requestDeleteTemplate(params).then(
                                  normalizeRequestOutputs,
                                );

                                if (error) return;

                                refsRef.current?.dialogs?.messages?.globalMessage?.push({
                                  title: '删除成功',
                                });

                                refsRef.current?.tables?.tplSettings?.reload();
                              },
                            }}
                          >
                            <OSTrigger
                              type="button"
                              settings={{
                                text: '删除',
                                type: 'link',
                                danger: true,
                              }}
                            />
                          </OSDialog>,
                        ],
                      };
                    },
                  },
                ]),
              }}
              requests={{
                requestDataSource: async (
                  params: OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
                ) => {
                  if (!requestTemplateList) return false;

                  const { error, data } = await requestTemplateList(params).then(
                    normalizeRequestOutputs,
                  );

                  if (error) return true;

                  return { error, data };
                },
              }}
            ></OSTable>
          ),
        }}
      >
        <OSTrigger
          type="button"
          settings={{
            text: '模板设置',
          }}
        ></OSTrigger>
      </OSDialog>
    );
  }, [
    refKeys.dialogs.modals.tplSettings,
    refKeys.forms.editTpl,
    refKeys.tables.tplSettings,
    refKeys.triggers.buttons.saveBtn,
    refsRef,
    requestApplayTemplateData,
    requestDeleteTemplate,
    requestTemplateDataSource,
    requestTemplateList,
    requestUpdateTemplateInfo,
    templateCreateFormSettings,
    templateSearchTableSettings,
  ]);

  const templateDom = useMemo(() => {
    if (enableTemplate === false) {
      return null;
    }
    return (
      <Space>
        <ApplyingTemplate
          ref={applyingTemplateRef}
          createFormRef={createFormRef}
          requestUpdateTemplateValues={requestUpdateTemplateValues}
          onSaveTplSussecc={() => {
            refsRef.current?.dialogs?.messages?.globalMessage?.push({
              title: '保存模板成功',
            });
          }}
        />
        {templateSettingDom}
        <OSDialog
          refKey={refKeys.dialogs.modals.tplCreate}
          type="modal"
          settings={{
            title: '另存为模板',
            width: 350,
            ...templateCreateModalSettings,
            body: (
              <OSForm
                refKey={refKeys.forms.createTpl}
                settings={templateCreateFormSettings}
              ></OSForm>
            ),
            footer: (
              <Row justify="end">
                <Col>
                  <OSTrigger
                    type="button"
                    settings={{
                      type: 'primary',
                      text: '新建',
                    }}
                    requests={{
                      requestAfterClick: async () => {
                        const results = await refsRef.current?.forms?.createTpl?.validate();

                        if (!results || results.error) return;
                        if (!requestTemplateCreate) return;

                        const { error } = await requestTemplateCreate({
                          values: results.data,
                          createFormValues:
                            refsRef.current?.forms?.createForm?.getDataSource() ?? {},
                        }).then(normalizeRequestOutputs);

                        if (error) return;

                        refsRef.current?.dialogs?.messages?.globalMessage?.push({
                          title: '创建成功',
                        });

                        refsRef.current?.forms?.createTpl?.resetFields();
                        refsRef.current?.dialogs?.modals?.tplCreate?.pop();
                      },
                    }}
                  ></OSTrigger>
                </Col>
              </Row>
            ),
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: '另存为',
            }}
          ></OSTrigger>
        </OSDialog>
      </Space>
    );
  }, [
    enableTemplate,
    refKeys.dialogs.modals.tplCreate,
    refKeys.forms.createTpl,
    refsRef,
    requestTemplateCreate,
    requestUpdateTemplateValues,
    templateCreateFormSettings,
    templateCreateModalSettings,
    templateSettingDom,
  ]);

  const footerDom = (
    <Row justify="space-between">
      <Col>{persistenceDom}</Col>
      <Col>
        <Space>
          {templateDom}
          <OSDialog
            refKey={refKeys.dialogs.popconfirms.createConfirm}
            type="popconfirm"
            settings={{
              title: '确认提交表单信息吗？',
              placement: 'topRight',
            }}
            requests={{
              requestAfterConfirm: async () => {
                if (!requests?.requestCreateSource) return false;

                const result = await createFormRef.current?.validate();
                if (!result || result.error) return false;

                const { error } = await requests
                  .requestCreateSource({
                    values: result.data,
                  })
                  .then(normalizeRequestOutputs);

                if (error) return true;

                refsRef.current?.dialogs?.messages?.globalMessage?.push({
                  title: '创建成功',
                });
                refsRef.current?.dialogs?.modals?.createModal?.pop();

                formUpdateTimestampRef.current?.removeData?.();

                return false;
              },
            }}
          >
            <OSTrigger
              type="button"
              settings={{
                type: 'primary',
                text: '确认',
              }}
              requests={{
                requestAfterClick: async () => {
                  const result = await createFormRef.current?.validate();
                  if (!result || result.error) return true;

                  return false;
                },
              }}
            />
          </OSDialog>
        </Space>
      </Col>
    </Row>
  );

  return (
    <OSReferencesCollectorProviderWrapper ref={refsRef}>
      <OSDialog
        refKey={refKeys.dialogs.modals.createModal}
        type="modal"
        onVisibleChange={(visible) => {
          setDialogVisible(visible);
        }}
        settings={{
          ...settings?.createModalDialogSettings,
          body: createFormDom,
          footer: footerDom,
        }}
      >
        <OSTrigger
          type="button"
          settings={{
            text: '创建',
            type: 'primary',
            ...settings?.createTriggerSettings,
          }}
        />
      </OSDialog>
    </OSReferencesCollectorProviderWrapper>
  );
};

export default React.forwardRef(OSActionsCreate);

export const ActionsCreateSettings: React.FC<OSActionsCreateType['settings']> = () => <></>;
export const ActionsCreateRequests: React.FC<OSActionsCreateType['requests']> = () => <></>;
export const ActionsCreateAPI: React.FC<OSActionsCreateAPI> = () => <></>;

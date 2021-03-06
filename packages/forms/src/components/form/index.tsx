import { LoadingOutlined } from '@ant-design/icons';
import {
  OSReferencesCollectorDispatchContext,
  PrioritizedComponentSizeContext,
} from '@ty-one-start/provider';
import { runFormSettings } from '@ty-one-start/utils';
import { getDataIndexId, getKeyIndexId } from '@ty-one-start/utils';
import type {
  OSEditableTableAPI,
  OSField,
  OSFieldAPI,
  OSFormAPI,
  OSFormFieldItemExtra,
  OSFormFieldItems,
  OSFormFieldItemSettingsFnOption,
  OSFormFieldItemWithStaticPureConfigs,
  OSFormGroupFieldType,
  OSFormGroupType,
  OSFormItemDependenciesConfigs,
  OSFormItemInputHistoryData,
  OSFormItemType,
  OSFormType,
  OSLayoutModalFormAPI,
  OSLayoutTabsFormAPI,
  OSTableAPI,
  RecordType,
  RequiredRecursion,
  ValueAsyncLinkage,
  _OSFormFieldItems,
} from '@ty-one-start/typings';
import { renderField } from '@ty-one-start/fields';
import { renderFormItem } from '@ty-one-start/form-items';
import {
  findParent,
  normalizeRequestOutputs,
  useActionsRef,
  useClsPrefix,
  useLoading,
  withDebounce,
} from '@ty-one-start/utils';
import type { FormInstance } from 'antd';
import { Col, Divider, Empty, Form, Row, Space, Spin, Typography } from 'antd';
import type { FormProps } from 'antd/es/form/Form';
import type { NamePath } from 'rc-field-form/es/interface';
import cls from 'classnames';
import EventEmitter from 'eventemitter3';
import utl from 'lodash';
import type { Moment } from 'moment';
import { isMoment } from 'moment';
import type { Meta } from 'rc-field-form/es/interface';
import type { ValidateErrorEntity } from 'rc-field-form/es/interface';
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ExtraValueTypesContext } from '@ty-one-start/provider';
import { FormInstanceContext } from '@ty-one-start/provider';
import { DEFAULT_LABEL_COL, DEFAULT_WRAPPER_COL } from './constants';
import GroupCollapse from './group-collapse';
import { execValueAsyncLinkage, execValueSyncLinkage } from './linkage';
import type { FormCoreActions } from './typings';
import { useRefObject } from './use-ref-object';
import { countLinkageLevel } from './utils/count-linkage-level';

const useAsyncInitialValues = ({
  actions,
  requestInitialValues: _requestInitialValues,
  asyncInitialValuesRef,
}: {
  actions: OSFormAPI;
  requestInitialValues?: RequiredRecursion<OSFormType>['requests']['requestInitialValues'];
  asyncInitialValuesRef: React.MutableRefObject<RecordType | undefined>;
}) => {
  const requestInitialValuesLoading = useLoading();

  const requestInitialValues = async () => {
    if (!_requestInitialValues) return;

    requestInitialValuesLoading.switch();
    const { error, data } = await _requestInitialValues({
      actions,
    }).then(normalizeRequestOutputs);

    if (!error) {
      // eslint-disable-next-line no-param-reassign
      asyncInitialValuesRef.current = data;
      actions.setFieldsValue(data);
    }
    requestInitialValuesLoading.switch();
  };

  useEffect(() => {
    requestInitialValues();
  }, []);

  return {
    requestInitialValuesLoading: requestInitialValuesLoading.loading,
  };
};

const OSForm: React.ForwardRefRenderFunction<OSFormAPI, OSFormType> = (props, ref) => {
  const {
    settings,
    onValuesChange,
    requests,
    value,
    onChange,
    name,
    onValuesLinkageChange,
    onDataSourceLinkageChange,
    onDataSourceChange,
    onFieldsChange,
  } = props;
  const {
    changeDebounceTimestamp = 450,
    fieldItems: _fieldItems,
    initialValues,
    valueLinkage,
    valueAsyncLinkage,
    labelCol,
    wrapperCol,
    fieldItemSettings,
    params: _params,
    hideEmpty = true,
    groupItemSettings,
    size,
  } = settings ?? {};
  const formRef = useRef<FormInstance>(null);
  const [form] = Form.useForm();
  const clsPrefix = useClsPrefix('os-form');
  const [requestDataSourceLoading, setRequestDataSourceLoading] = useState(false);
  const [asyncFieldItems, setAsyncFieldItems] = useState<
    RequiredRecursion<OSFormType>['settings']['fieldItems'] | undefined
  >();
  const formWrapperRef = useRef<HTMLDivElement>(null);

  const extraValueTypes = useContext(ExtraValueTypesContext);
  const referencesDispatch = useContext(OSReferencesCollectorDispatchContext);
  const asyncInitialValuesRef = useRef<RecordType>();
  const [eventBus] = useState(new EventEmitter());

  const [historyDataMaps, setHistoryDataMaps] =
    useState<Record<string, OSFormItemInputHistoryData[]>>();

  const defaultLayout = 'horizontal';
  const formLayoutMode = settings?.layout ?? defaultLayout;

  const formLabelCol = labelCol ?? DEFAULT_LABEL_COL;
  const formWrapperCol = wrapperCol ?? DEFAULT_WRAPPER_COL;

  const refObectApis = useRefObject();

  const pcs = useContext(PrioritizedComponentSizeContext);

  /**
   * TODO: ?????? form ????????? labelCol ??? wrapperCol ?????? fieldItemsSettings ??????
   */
  const finalFormWrapperCol = (() => {
    if (formLayoutMode === 'inline') {
      return undefined;
    }
    /** ???????????????wrapper ???????????????????????????????????? */
    if (formLayoutMode === 'vertical') {
      return { span: 24 };
    }
    return formWrapperCol;
  })();

  const finalFormLabelCol = (() => {
    return formLayoutMode === 'inline' ? undefined : formLabelCol;
  })();

  const finalFieldItemSettings = (() => {
    if (fieldItemSettings) {
      return {
        ...fieldItemSettings,
        wrapperCol: (() => {
          if (formLayoutMode === 'inline') {
            return undefined;
          }
          /** ???????????????wrapper ???????????????????????????????????? */
          if (formLayoutMode === 'vertical') {
            return { span: 24 };
          }
          return fieldItemSettings.wrapperCol;
        })(),
        labelCol: (() => {
          return formLayoutMode === 'inline' ? undefined : fieldItemSettings.labelCol;
        })(),
      };
    }
    return fieldItemSettings;
  })();

  const leafFieldItemComponentRefRefs = useRef<
    Record<
      string,
      {
        keyIndexId: string;
        valueType: string;
        ref: React.RefObject<OSFieldAPI>;
      }
    >
  >({});

  /** ?????????????????? ref */
  const leafDataIndexIdToComponentRefRef = useRef<Record<string, React.RefObject<RecordType>>>({});
  /** ???????????? dataIndexId ??? ?????? configs ????????? */
  const leafDataIndexIdToStaticPureConfigsMapRef = useRef<
    Record<string, OSFormFieldItemWithStaticPureConfigs>
  >({});
  /** ??????????????????????????? keyIndexId ?????? */
  const currentHideLeafKeyIndexIdSetRef = useRef<Set<string>>(new Set());
  /** ???????????????????????? keyIndexId ?????? */
  const currentVisibleLeafKeyIndexIdSetRef = useRef<Set<string>>(new Set());
  /** ???????????? keyIndexId ??? dataIndexId ????????? */
  const leafKeyIndexIdToDataIndexIdMapRef = useRef<Record<string, string>>({});
  /** formItem ???????????? keyIndexId ????????? */
  const keyIndexIdToStaticSettingsMapRef = useRef<
    Record<string, OSFormFieldItemWithStaticPureConfigs['settings']>
  >({});
  /** ??? formItem keyIndexId ???????????? keyIndexId ??????????????? */
  const keyIndexIdToChildrenKeyIndexIdsMapRef = useRef<Record<string, Set<string>>>({});

  const syncValueLinkageSortedRef = useRef<
    {
      keyIndexId: string;
      linkage: RequiredRecursion<OSFormItemType>['settings']['valueLinkage'];
    }[]
  >([]);

  const asyncValueLinkageSortedRef = useRef<
    {
      keyIndexId: string;
      linkage: RequiredRecursion<OSFormItemType>['settings']['valueAsyncLinkage'];
    }[]
  >([]);

  const contextRef = useRef<RecordType>({});

  const latestUserInputValueRef = useRef();

  /** ????????? fields ??? value????????? editable-table ??? value ????????? { target: xxx } */
  const normalizeFieldsValue = (values: RecordType): RecordType => {
    return utl.mapValues(values, (fieldValue, dataIndexId) => {
      const fieldStaticPureConfigs = leafDataIndexIdToStaticPureConfigsMapRef.current[dataIndexId];
      if (fieldStaticPureConfigs && fieldValue) {
        if (fieldStaticPureConfigs.type === 'editable-table') {
          /**
           * 1. editable-table ?????? fieldItem dataIndex ??????
           * 2. editable-table ????????????????????????????????? dataIndex
           */
          const next = (
            leafDataIndexIdToComponentRefRef.current[
              getDataIndexId(fieldStaticPureConfigs.settings?.dataIndex)
            ]?.current as OSTableAPI
          )?.getDataSource();
          return next;
        }
        if (
          fieldStaticPureConfigs.type === 'layout-modal-form' ||
          fieldStaticPureConfigs.type === 'form' ||
          fieldStaticPureConfigs.type === 'layout-tabs-form'
        ) {
          /** ???????????? normalizeFieldItemValue */
          const api = leafDataIndexIdToComponentRefRef.current[
            getDataIndexId(fieldStaticPureConfigs.settings?.dataIndex)
          ]?.current as OSFormAPI | OSLayoutModalFormAPI | undefined;

          /** ?????? field-items ??????????????????????????????????????? field-items ?????????????????????????????? values */
          if (
            fieldStaticPureConfigs.type === 'form' ||
            fieldStaticPureConfigs.type === 'layout-modal-form'
          ) {
            if (api?.isFieldItemsReady() === false) {
              return fieldValue;
            }
          }
          return api?.getDataSource();
        }
        /**
         * ??????????????? date ?????? date-range ???????????? onChange ????????? string???
         * ????????? rule ???????????? linkage ??????????????????????????????????????????????????????????????????
         */
        if (fieldStaticPureConfigs.type === 'date') {
          return isMoment(fieldValue)
            ? fieldValue?.format(fieldStaticPureConfigs.settings?.format ?? 'YYYY-MM-DD')
            : fieldValue;
        }
        if (fieldStaticPureConfigs.type === 'date-range') {
          return fieldValue.map((item: Moment | string) =>
            isMoment(item)
              ? item?.format(fieldStaticPureConfigs.settings?.format ?? 'YYYY-MM-DD')
              : item,
          );
        }
      }
      return fieldValue;
    });
  };

  const getVisibleLeafDataIndexs = () => {
    const validateDataIndexs = Array.from(currentVisibleLeafKeyIndexIdSetRef.current).map(
      (hideKeyIndexId) => leafKeyIndexIdToDataIndexIdMapRef.current[hideKeyIndexId],
    );
    return validateDataIndexs;
  };

  const setDataSource = (dataSource_?: RecordType) => {
    form.setFieldsValue(dataSource_);
    onChange?.(dataSource_);
  };

  const getDataSource = (nameList?: NamePath[] | true) => {
    const values = normalizeFieldsValue(
      nameList == null
        ? formRef.current?.getFieldsValue()
        : formRef.current?.getFieldsValue(nameList),
    );
    return values;
  };

  /**
   * ???????????????????????????????????????????????????????????????????????????????????????
   * ??????????????????????????????????????????????????????????????????
   */
  const clearPrevUserCellInputs = () => {
    latestUserInputValueRef.current = undefined;
  };

  const validate = async (
    nameList?: NamePath[],
  ): Promise<
    | {
        error: false;
        data: RecordType;
      }
    | {
        error: true;
        data: ValidateErrorEntity;
      }
  > => {
    try {
      const validateDataIndexs = Array.from(currentVisibleLeafKeyIndexIdSetRef.current).map(
        (hideKeyIndexId) => leafKeyIndexIdToDataIndexIdMapRef.current[hideKeyIndexId],
      );

      const values = await formRef.current?.validateFields(nameList ?? validateDataIndexs);
      return {
        error: false,
        data: normalizeFieldsValue(values),
      };
    } catch (errors) {
      return { error: true, data: errors as ValidateErrorEntity };
    }
  };

  const validateRecursion = async (nameList?: NamePath[]) => {
    await Promise.all(
      Object.keys(leafFieldItemComponentRefRefs.current)
        .map((key) => {
          const meta = leafFieldItemComponentRefRefs.current[key];
          if (['layout-modal-form', 'form', 'layout-tabs-form'].includes(meta.valueType)) {
            return (
              meta.ref.current as OSFormAPI | OSLayoutModalFormAPI | OSLayoutTabsFormAPI | null
            )?.validate(nameList);
          }
          return null;
        })
        .filter(
          (
            item,
          ): item is Promise<
            | {
                error: false;
                data: RecordType;
              }
            | {
                error: true;
                data: ValidateErrorEntity;
              }
          > => Boolean(item),
        ),
    );
    return validate(nameList);
  };

  const updateContext = (data: RecordType) => {
    contextRef.current = {
      ...contextRef.current,
      ...data,
    };
  };

  const getContext = () => {
    return contextRef.current;
  };

  const setFieldsValue = (
    value_?: RecordType,
    options?: {
      cleanCache?: boolean;
    },
  ) => {
    if (options?.cleanCache !== false) {
      /**
       * ???????????????????????????????????????????????????????????????????????????????????????
       * ??????????????????????????????????????????????????????????????????
       */
      Object.keys(leafFieldItemComponentRefRefs.current).forEach((key) => {
        const meta = leafFieldItemComponentRefRefs.current[key];
        if (
          ['editable-table', 'form', 'layout-modal-form', 'layout-tabs-form'].includes(
            meta.valueType,
          )
        ) {
          (
            meta.ref.current as unknown as
              | OSEditableTableAPI
              | OSFormAPI
              | OSLayoutModalFormAPI
              | OSLayoutTabsFormAPI
              | undefined
          )?.clearPrevUserCellInputs();
        }
      });
    }

    return form.setFieldsValue(value_);
  };

  const handleDataSourceChange = (
    dataSource: RecordType,
    callback: (dataSource: RecordType) => void,
  ) => {
    const validateDataIndexs = getVisibleLeafDataIndexs();
    const next = normalizeFieldsValue(utl.pick(dataSource, validateDataIndexs));
    callback(next);
  };

  const coreActionsRef = useActionsRef<FormCoreActions>({
    setFieldsValue,
    onChange,
    onValuesLinkageChange,
    valueAsyncLinkage,
    valueLinkage,
    onDataSourceLinkageChange: (dataSource: RecordType) => {
      if (typeof onDataSourceLinkageChange === 'function') {
        handleDataSourceChange(dataSource, onDataSourceLinkageChange);
      }
    },
    onDataSourceChange: (dataSource: RecordType) => {
      if (typeof onDataSourceChange === 'function') {
        handleDataSourceChange(dataSource, onDataSourceChange);
      }
    },
    once(...args) {
      return eventBus.once(...args);
    },
    on(...args) {
      return eventBus.on(...args);
    },
    off(...args) {
      return eventBus.off(...args);
    },
    emit(...args) {
      return eventBus.emit(...args);
    },
  });

  const asyncLinkCountRef = useRef(0);

  const linkageChange = ({
    values,
    changedValues,
    scopeLinkCount,
  }: {
    values: RecordType;
    changedValues: RecordType;
    scopeLinkCount?: number;
  }) => {
    const syncValues = (meta: { values: RecordType; changedValues: RecordType }) => {
      /** ???????????? changedValues ????????? values ??? diff?????????????????? */
      if (
        Object.keys(meta.changedValues).some((changedField) => {
          return meta.changedValues[changedField] !== values[changedField];
        })
      ) {
        formRef.current?.setFieldsValue(meta.changedValues);
        coreActionsRef.current.onChange?.(meta.values);
        coreActionsRef.current.onValuesLinkageChange?.(meta.changedValues, meta.values);
        coreActionsRef.current.onDataSourceLinkageChange(meta.values);
      }
    };

    const linkageResult = execValueSyncLinkage(changedValues, values, [
      ...syncValueLinkageSortedRef.current.map((item) => item.linkage.linkage),
      ...(coreActionsRef.current.valueLinkage ?? []),
    ]);

    execValueAsyncLinkage(
      linkageResult.changedValues,
      linkageResult.values,
      {
        parallel: asyncValueLinkageSortedRef.current.reduce((merged, next) => {
          if (next.linkage.parallel) {
            return {
              ...merged,
              [next.keyIndexId]: next.linkage.parallel,
            };
          }
          return merged;
        }, coreActionsRef.current.valueAsyncLinkage?.parallel ?? {}),
        serial: [
          ...asyncValueLinkageSortedRef.current
            .map((item) => item.linkage.serial?.linkage)
            .filter((item): item is ValueAsyncLinkage => !!item),
          ...(coreActionsRef.current.valueAsyncLinkage?.serial ?? []),
        ],
      },
      (asyncLinkageResult) => {
        if (scopeLinkCount != null) {
          if (asyncLinkCountRef.current === scopeLinkCount) {
            syncValues(asyncLinkageResult);
            return;
          }
          /** ?????????????????? */
          return;
        }
        syncValues(asyncLinkageResult);
      },
    );
  };

  const setFieldsValueAndTriggeLinkage = (changedValues?: RecordType) => {
    if (changedValues == null || Object.keys(changedValues).length === 0) return;
    form.setFieldsValue(changedValues);

    const values = form.getFieldsValue();

    linkageChange({
      values,
      changedValues,
    });
  };

  const getFieldsValue = (nameList?: NamePath[] | true, filterFunc?: (meta: Meta) => boolean) => {
    return nameList == null ? form.getFieldsValue() : form.getFieldsValue(nameList, filterFunc);
  };

  const formActionsRef = useActionsRef<OSFormAPI>({
    ...refObectApis,
    clearPrevUserCellInputs,
    validateRecursion,
    isFieldItemsReady: () => {
      if (requests?.requestFieldItems) {
        return asyncFieldItems != null;
      }
      return true;
    },
    normalizeFieldsValue,
    setDataSource,
    getDataSource,
    validate,
    getFieldsValue,
    setFieldsValue,
    resetFields: () => {
      form.resetFields();
      if (asyncInitialValuesRef.current) {
        form.setFieldsValue(asyncInitialValuesRef.current);
      }
    },
    getFieldsError: form.getFieldsError,
    updateContext,
    getContext,
    setFieldsValueAndTriggeLinkage,
  });

  const requestFieldItems = async (params?: RecordType) => {
    if (!requests?.requestFieldItems) return;

    // setLoading(true);
    const { error, data } = await requests
      .requestFieldItems({
        actions: formActionsRef.current,
        params,
      })
      .then(normalizeRequestOutputs);
    // setLoading(false);
    if (error) return;

    setAsyncFieldItems(data?.fieldItems ?? []);
  };

  const requestRichDataSource = async () => {
    if (!requests?.requestRichDataSource) {
      return;
    }

    setRequestDataSourceLoading(true);
    const { error, data } = await requests
      .requestRichDataSource({
        actions: formActionsRef.current,
      })
      .then(normalizeRequestOutputs);
    setRequestDataSourceLoading(false);

    if (error) return;

    form.setFieldsValue(data?.values);
    onChange?.(data?.values);

    if (data?.history) {
      setHistoryDataMaps(data.history);
    }
  };

  const requestDataSource = async () => {
    if (!requests?.requestDataSource) {
      return;
    }

    setRequestDataSourceLoading(true);
    const { error, data } = await requests
      .requestDataSource({
        actions: formActionsRef.current,
      })
      .then(normalizeRequestOutputs);
    setRequestDataSourceLoading(false);

    if (error) return;

    form.setFieldsValue(data);
    onChange?.(data);
  };

  const getFormGroupKeyIndexClassName = (keyIndexId?: string) => {
    if (keyIndexId) {
      return `os-col-${keyIndexId}`;
    }
    return undefined;
  };

  const hideFormGroupRowItemDom = (colDom: Element | null | undefined) => {
    const target = findParent(colDom, (parent) =>
      parent.classList.contains(`${clsPrefix}-group-row-item`),
    );
    /** ?????????????????????????????????????????? */
    if (
      target &&
      Array.from(target.querySelectorAll(`.${clsPrefix}-group-col-item`)).every((item) =>
        item.classList.contains('hide'),
      )
    ) {
      target.classList.add('hide');
    }
  };

  const showFormGroupRowItemDom = (colDom: Element | null | undefined) => {
    const target = findParent(colDom, (parent) =>
      parent.classList.contains(`${clsPrefix}-group-row-item`),
    );
    target?.classList.remove('hide');
  };

  const hideFormGroupItemDom = (keyIndexId?: string) => {
    if (keyIndexId) {
      const clsId = `.${getFormGroupKeyIndexClassName(keyIndexId)}`;
      const colDom = formWrapperRef.current?.querySelector(clsId);
      colDom?.classList.add('hide');
      hideFormGroupRowItemDom(colDom);
    }
  };

  const showFormGroupItemDom = (keyIndexId?: string) => {
    if (keyIndexId) {
      const colDom = formWrapperRef.current?.querySelector(
        `.${getFormGroupKeyIndexClassName(keyIndexId)}`,
      );
      colDom?.classList.remove('hide');
      showFormGroupRowItemDom(colDom);
    }
  };

  useImperativeHandle(ref, () => {
    return formActionsRef.current;
  });

  const actionsRef = useActionsRef({
    hideFormGroupItemDom,
    showFormGroupItemDom,
    requestFieldItems,
  });

  const { requestInitialValuesLoading } = useAsyncInitialValues({
    actions: formActionsRef.current,
    requestInitialValues: requests?.requestInitialValues,
    asyncInitialValuesRef,
  });

  const renderItems = (
    fieldItems?: OSFormFieldItems,
    parentKeyIndexId?: string,
  ): React.ReactNode[] => {
    currentHideLeafKeyIndexIdSetRef.current = new Set();
    currentVisibleLeafKeyIndexIdSetRef.current = new Set();
    leafKeyIndexIdToDataIndexIdMapRef.current = {};
    leafDataIndexIdToStaticPureConfigsMapRef.current = {};
    leafDataIndexIdToComponentRefRef.current = {};
    keyIndexIdToChildrenKeyIndexIdsMapRef.current = {};
    syncValueLinkageSortedRef.current = [];
    asyncValueLinkageSortedRef.current = [];

    if (!hideEmpty && (!fieldItems || fieldItems.length === 0)) {
      return [<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />];
    }
    const renderItemsInner = (
      fieldItems_?: OSFormFieldItems,
      parentKeyIndexId_?: string,
    ): React.ReactNode[] => {
      return (fieldItems_ ?? []).map((fieldItem, index) => {
        const {
          type: valueType,
          requests: _requests,
          settings: _settings,
          dependencies,
        } = fieldItem;

        const staticSettings = runFormSettings(fieldItem.settings, {
          form,
          actions: formActionsRef.current,
        });

        const mergedStaticSettings: OSFormFieldItemWithStaticPureConfigs['settings'] = {
          ...finalFieldItemSettings,
          ...staticSettings,
        };

        const dataIndexId = getDataIndexId(mergedStaticSettings.dataIndex);
        const keyIndexId =
          valueType === 'group'
            ? getKeyIndexId(
                mergedStaticSettings.key ??
                  mergedStaticSettings.dataIndex ??
                  mergedStaticSettings.title,
              )
            : getKeyIndexId(mergedStaticSettings.key ?? mergedStaticSettings.dataIndex);

        keyIndexIdToStaticSettingsMapRef.current[keyIndexId] = mergedStaticSettings;

        if (valueType === 'group' && fieldItem.children) {
          const items = renderItemsInner(fieldItem.children, keyIndexId);
          /** ??????????????????????????? */
          const isChildrenAllHiden = () => {
            return fieldItem.children?.every((item) => {
              const _staticSettings = runFormSettings(item.settings, {
                form,
                actions: formActionsRef.current,
              });
              return _staticSettings?.hide || item.type === 'option';
            });
          };

          const groupId = uuid();
          const groupClass = `${clsPrefix}-group-item`;
          const dividerClass = `${clsPrefix}-divider-item`;
          const groupRowClass = `${clsPrefix}-group-row-item`;

          return (
            <div id={groupId} className={groupClass}>
              {mergedStaticSettings?.title && (
                <Divider
                  orientation="left"
                  plain
                  style={{ marginTop: 15, marginBottom: 25 }}
                  className={cls(`${clsPrefix}-divider-item`)}
                >
                  <Space size={5}>
                    <Typography.Text strong>{mergedStaticSettings?.title}</Typography.Text>
                    {!mergedStaticSettings?.hide && (
                      <GroupCollapse
                        groupId={groupId}
                        groupClass={groupClass}
                        dividerClass={dividerClass}
                        groupRowClass={groupRowClass}
                      />
                    )}
                    {(mergedStaticSettings as OSFormGroupFieldType['settings'])?.actions?.map(
                      (item, _index) =>
                        React.cloneElement(item, {
                          key: item.key ?? _index,
                        }),
                    )}
                  </Space>
                </Divider>
              )}
              <Row
                className={cls(groupRowClass, {
                  hide: isChildrenAllHiden(),
                })}
                gutter={groupItemSettings?.gutter}
              >
                {items.map((item, _index) => {
                  const renderCol = (child?: React.ReactNode) => {
                    const childrenSettings = Array.from(
                      /** type group ????????????????????? key */
                      keyIndexIdToChildrenKeyIndexIdsMapRef.current[keyIndexId] ?? [],
                    ).map(
                      (childKeyIndexId) =>
                        keyIndexIdToStaticSettingsMapRef.current[childKeyIndexId],
                    );
                    const currentFieldItemStaticSettings = childrenSettings[_index];
                    const getFieldItemColId = () => {
                      if (keyIndexId) {
                        return getKeyIndexId(
                          currentFieldItemStaticSettings?.key ??
                            currentFieldItemStaticSettings?.dataIndex,
                        );
                      }
                      return undefined;
                    };
                    const clsId = getFormGroupKeyIndexClassName(getFieldItemColId());
                    const totalLength = items.length;

                    const colAuto = currentFieldItemStaticSettings?.colSpan
                      ? false
                      : currentFieldItemStaticSettings?.colAuto ?? true;

                    return (
                      <Col
                        className={cls(clsId, `${clsPrefix}-group-col-item`)}
                        span={(() => {
                          if (formLayoutMode === 'inline') {
                            return undefined;
                          }

                          if (currentFieldItemStaticSettings?.colSpan) {
                            return currentFieldItemStaticSettings?.colSpan;
                          }
                          if (colAuto) {
                            if (totalLength === 0) {
                              return undefined;
                            }
                            return Math.round(24 / totalLength);
                          }
                          return undefined;
                        })()}
                      >
                        {child}
                      </Col>
                    );
                  };

                  /** ?????????????????? Col ??????????????????????????? */
                  if (item == null) {
                    return renderCol();
                  }

                  return renderCol(item);
                })}
              </Row>
            </div>
          );
        }

        if (parentKeyIndexId_) {
          if (keyIndexIdToChildrenKeyIndexIdsMapRef.current[parentKeyIndexId_]) {
            keyIndexIdToChildrenKeyIndexIdsMapRef.current[parentKeyIndexId_].add(keyIndexId);
          } else {
            keyIndexIdToChildrenKeyIndexIdsMapRef.current[parentKeyIndexId_] = new Set([
              keyIndexId,
            ]);
          }
        }
        const dom = renderFormItem(valueType, _settings, _requests, {
          historyData: historyDataMaps?.[dataIndexId],
          formRef,
          actions: formActionsRef.current,
          dependencies,
          getField: (
            staticFieldSettings,
            staticFieldRequests,
            formItemSettings,
            formItemRequests,
            options,
          ) => {
            leafFieldItemComponentRefRefs.current[keyIndexId] = {
              keyIndexId,
              valueType: valueType!,
              ref: options?.ref ?? React.createRef(),
            };
            return renderField(
              staticFieldSettings?.readonly ? 'read' : 'edit',
              valueType,
              staticFieldSettings,
              staticFieldRequests,
              {
                types: extraValueTypes,
                props: { ...options?.props, eventBus, name: formItemSettings?.dataIndex },
                ref: leafFieldItemComponentRefRefs.current[keyIndexId].ref,
                formRef,
                isWrapFormItem: true,
                wrapFormType: 'form',
              },
            );
          },
          fieldItemSettings: finalFieldItemSettings,
          className: cls(
            parentKeyIndexId_ == null && index === fieldItems_!.length - 1
              ? 'is-lastest-row-item'
              : undefined,
          ),
          readonly: mergedStaticSettings?.readonly,
          hideFormGroupItemDom: actionsRef.current.hideFormGroupItemDom,
          showFormGroupItemDom: actionsRef.current.showFormGroupItemDom,
          currentHideLeafKeyIndexIdSetRef,
          currentVisibleLeafKeyIndexIdSetRef,
          leafDataIndexIdToStaticPureConfigsMapRef,
          leafDataIndexIdToComponentRefRef,
          leafKeyIndexIdToDataIndexIdMapRef,
          keyIndexIdToStaticSettingsMapRef,
        });

        return dom;
      });
    };

    const items = renderItemsInner(fieldItems, parentKeyIndexId);

    const syncCounts = countLinkageLevel(keyIndexIdToStaticSettingsMapRef.current, [
      'valueLinkage',
      'afterIndexIdRegisted',
    ]);
    const asyncCounts = countLinkageLevel(keyIndexIdToStaticSettingsMapRef.current, [
      'valueAsyncLinkage',
      'serial',
      'afterIndexIdRegisted',
    ]);

    const sortLinkges = (
      refItem: React.MutableRefObject<
        {
          keyIndexId: string;
          linkage:
            | RequiredRecursion<OSFormItemType>['settings']['valueLinkage']
            | RequiredRecursion<OSFormItemType>['settings']['valueAsyncLinkage'];
        }[]
      >,
      keyName: 'valueLinkage' | 'valueAsyncLinkage',
      counts: Record<string, number>,
    ) => {
      // eslint-disable-next-line no-param-reassign
      refItem.current = Object.keys(counts)
        .sort((a, b) => {
          const sortA = counts[a];
          const sortB = counts[b];
          return sortB - sortA;
        })
        .map((key) => {
          return {
            keyIndexId: key,
            linkage: keyIndexIdToStaticSettingsMapRef.current[key]?.[keyName],
          };
        })
        .filter(
          (
            item,
          ): item is {
            keyIndexId: string;
            linkage:
              | RequiredRecursion<OSFormItemType>['settings']['valueLinkage']
              | RequiredRecursion<OSFormItemType>['settings']['valueAsyncLinkage'];
          } => item.linkage != null,
        );
    };

    sortLinkges(syncValueLinkageSortedRef, 'valueLinkage', syncCounts);
    sortLinkges(asyncValueLinkageSortedRef, 'valueAsyncLinkage', asyncCounts);

    return items;
  };

  const handleFormFieldsChange: FormProps['onFieldsChange'] = (changedFields, fields) => {
    onFieldsChange?.(changedFields, fields);
  };

  const changedMetaCacheRef = useRef<{
    changedValues?: RecordType;
    values?: RecordType;
  }>({});

  const handleAccChange: FormProps['onValuesChange'] = withDebounce(changeDebounceTimestamp)(
    (changedValues, values) => {
      changedMetaCacheRef.current = {};

      onChange?.(values);

      asyncLinkCountRef.current += 1;

      linkageChange({
        values,
        changedValues,
        scopeLinkCount: asyncLinkCountRef.current,
      });
    },
  );

  const handleChange: FormProps['onValuesChange'] = (changedValues, values) => {
    utl.merge(changedMetaCacheRef.current, {
      changedValues,
      values,
    });
    handleAccChange(changedMetaCacheRef.current.changedValues, changedMetaCacheRef.current.values);
  };

  useEffect(() => {
    actionsRef.current.requestFieldItems(_params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionsRef, JSON.stringify(_params)]);

  useEffect(() => {
    const apis = formActionsRef.current;
    if (props.refKey) {
      referencesDispatch({
        type: 'registe',
        payload: {
          type: 'forms',
          key: props.refKey,
          apis,
        },
      });
    }
  });

  useEffect(() => {
    if (requests?.requestRichDataSource) {
      requestRichDataSource();
    } else {
      requestDataSource();
    }
  }, []);

  useEffect(() => {
    const old = formRef.current?.getFieldsValue();
    /** ??????????????? val ????????? errors??????????????? diff */
    const next = utl.omitBy(value, (val, key) => {
      if (
        old?.[key] !== val &&
        typeof latestUserInputValueRef.current === 'object' &&
        key in latestUserInputValueRef.current!
      ) {
        return true;
      }

      return val === old[key];
    });
    formRef.current?.setFieldsValue(next);
  }, [value]);

  useEffect(() => {
    /** ????????????????????? hide ????????? */
    currentHideLeafKeyIndexIdSetRef.current.forEach((keyIndexId) =>
      hideFormGroupItemDom(keyIndexId),
    );
  }, []);

  return (
    <FormInstanceContext.Provider value={formRef}>
      <Spin
        spinning={requestInitialValuesLoading || requestDataSourceLoading}
        indicator={<LoadingOutlined />}
      >
        <div ref={formWrapperRef}>
          <Form
            size={size ?? pcs.size}
            name={name}
            ref={formRef}
            form={form}
            layout={formLayoutMode}
            className={clsPrefix}
            labelCol={finalFormLabelCol}
            wrapperCol={finalFormWrapperCol}
            initialValues={initialValues}
            onFieldsChange={handleFormFieldsChange}
            onValuesChange={(changedValues, values) => {
              latestUserInputValueRef.current = changedValues;

              onValuesChange?.(changedValues, values);
              handleChange?.(changedValues, values);

              coreActionsRef.current.onDataSourceChange(values);
            }}
          >
            {renderItems(requests?.requestFieldItems ? asyncFieldItems : _fieldItems)}
          </Form>
        </div>
      </Spin>
    </FormInstanceContext.Provider>
  );
};

export default React.forwardRef(OSForm);

export const FormSettings: React.FC<OSFormType['settings']> = () => <></>;
export const FormRequests: React.FC<OSFormType['requests']> = () => <></>;
export const FormGroupItemType: React.FC<OSFormGroupType<_OSFormFieldItems<OSField>>> = () => <></>;
export const FormFieldItemExtraSettings: React.FC<OSFormFieldItemExtra['settings']> = () => <></>;
export const FormItemTypeSettings: React.FC<OSFormItemType['settings']> = () => <></>;
export const FormItemTypeRequests: React.FC<OSFormItemType['requests']> = () => <></>;
export const FormItemDependenciesConfigs: React.FC<OSFormItemDependenciesConfigs> = () => <></>;
export const FormAPI: React.FC<OSFormAPI> = () => <></>;
export const FormFieldItemSettingsFnOption: React.FC<OSFormFieldItemSettingsFnOption> = () => <></>;

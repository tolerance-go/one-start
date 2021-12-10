import { LoadingOutlined } from '@ant-design/icons';
import type { FormInstance } from '@ty/antd';
import { Col, Divider, Form, Row, Space, Spin, Typography } from '@ty/antd';
import type { NamePath } from '@ty/antd/lib/form/interface';
import cls from 'classnames';
import utl from 'lodash';
import type { Moment } from 'moment';
import { isMoment } from 'moment';
import type { Meta } from 'rc-field-form/es/interface';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import React, {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import { useActionsRef } from '../hooks/use-actions-ref';
import { ExtraValueTypesContext } from '../providers/extra-value-types';
import { FormInstanceContext } from '../providers/form-context';
import { OSReferencesCollectorDispatchContext } from '../providers/references';
import { getDataIndexId, getKeyIndexId, runFormSettings } from '../table/utils';
import type {
  OSField,
  OSFormAPI,
  OSFormFieldItemExtra,
  OSFormFieldItems,
  OSFormFieldItemSettingsFnOption,
  OSFormFieldItemWithStaticPureConfigs,
  OSFormGroupFieldType,
  OSFormGroupType,
  OSFormItemDependenciesConfigs,
  OSFormItemType,
  OSFormType,
  OSTableAPI,
  RecordType,
  ValueAsyncLinkage,
  _OSFormFieldItems,
  OSEditableTableAPI,
  OSFieldAPI,
} from '../typings';
import { findParent } from '../utils/dom-tree';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { renderField } from '../utils/render-field';
import { renderFormItem } from '../utils/render-form-item';
import type { RequiredRecursion } from '../utils/typings';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useLoading } from '../utils/use-loading';
import GroupCollapse from './group-collapse';
import { handleAsyncLinkage, valueLinkageHandler } from './linkage';

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
  } = props;
  const {
    fieldItems: _fieldItems,
    initialValues,
    valueLinkage,
    valueAsyncLinkage,
    labelCol,
    wrapperCol,
    fieldItemSettings,
  } = settings ?? {};
  const formRef = useRef<FormInstance>(null);
  const [form] = Form.useForm();
  const clsPrefix = useClsPrefix('os-form');
  const [requestDataSourceLoading, setRequestDataSourceLoading] = useState(false);
  const formWrapperRef = useRef<HTMLDivElement>(null);

  const extraValueTypes = useContext(ExtraValueTypesContext);
  const referencesDispatch = useContext(OSReferencesCollectorDispatchContext);
  const asyncInitialValuesRef = useRef<RecordType>();

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

  /** 子节点的组件 ref */
  const leafDataIndexIdToComponentRefRef = useRef<Record<string, React.RefObject<RecordType>>>({});
  /** 子节点的 dataIndexId 到 静态 configs 的映射 */
  const leafDataIndexIdToStaticPureConfigsMapRef = useRef<
    Record<string, OSFormFieldItemWithStaticPureConfigs>
  >({});
  /** 当前不可见的子节点 keyIndexId 数组 */
  const currentHideLeafKeyIndexIdSetRef = useRef<Set<string>>(new Set());
  /** 当前可见的子节点 keyIndexId 数组 */
  const currentVisibleLeafKeyIndexIdSetRef = useRef<Set<string>>(new Set());
  /** 子节点的 keyIndexId 到 dataIndexId 的映射 */
  const leafKeyIndexIdToDataIndexIdMapRef = useRef<Record<string, string>>({});
  /** formItem 配置和其 keyIndexId 的映射 */
  const keyIndexIdToStaticSettingsMapRef = useRef<
    Record<string, OSFormFieldItemWithStaticPureConfigs['settings']>
  >({});
  /** 父 formItem keyIndexId 和其子项 keyIndexId 数组的映射 */
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

  /** 正常化 fields 的 value，比如 editable-table 的 value 可能为 { target: xxx } */
  const normalizeFieldsValue = (values: RecordType): RecordType => {
    return utl.mapValues(values, (fieldValue, dataIndexId) => {
      const fieldStaticPureConfigs = leafDataIndexIdToStaticPureConfigsMapRef.current[dataIndexId];
      if (fieldStaticPureConfigs && fieldValue) {
        if (fieldStaticPureConfigs.type === 'editable-table') {
          /**
           * 1. editable-table 假设 fieldItem dataIndex 唯一
           * 2. editable-table 假设不会设置两层及以上 dataIndex
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
          /** 内部会做 normalizeFieldItemValue */
          return (
            leafDataIndexIdToComponentRefRef.current[
              getDataIndexId(fieldStaticPureConfigs.settings?.dataIndex)
            ]?.current as OSFormAPI
          )?.getDataSource();
        }
        /**
         * 为什么不在 date 或者 date-range 内部设置 onChange 转换为 string，
         * 这样在 rule 或者其他 linkage 内部，数据操作就变的很麻烦，需要重新封装类型
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

  const getDataSource = () => {
    const validateDataIndexs = getVisibleLeafDataIndexs();
    const values = normalizeFieldsValue(formRef.current?.getFieldsValue(validateDataIndexs));
    return values;
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

  const contextRef = useRef<RecordType>({});

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
       * 清空上一次单元格用户输入，原作用是避免数值联动冲掉当前输入
       * 但是在手动设置的情况下，需要先清理，避免无效
       */
      Object.keys(leafFieldItemComponentRefRefs.current).forEach((key) => {
        const meta = leafFieldItemComponentRefRefs.current[key];
        if (meta.valueType === 'editable-table') {
          (
            meta.ref.current as unknown as OSEditableTableAPI | undefined
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

  const coreActionsRef = useActionsRef({
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
  });

  const linkageChange = useCallback(
    ({ values, changedValues }: Record<string, RecordType>) => {
      const isRegistedValueAsyncLinkage =
        coreActionsRef.current.valueAsyncLinkage || asyncValueLinkageSortedRef.current.length;

      const isRegisteValueSyncLinkage =
        coreActionsRef.current.valueLinkage || syncValueLinkageSortedRef.current.length;

      const asyncLinkageCount = async (valuesData: {
        changedValues: RecordType;
        values: RecordType;
      }) => {
        if (isRegistedValueAsyncLinkage) {
          handleAsyncLinkage(
            valuesData.changedValues,
            valuesData.values,
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
              formRef.current?.setFieldsValue(asyncLinkageResult.changedValues);
              coreActionsRef.current.onValuesLinkageChange?.(
                asyncLinkageResult.changedValues,
                asyncLinkageResult.values,
              );
              coreActionsRef.current.onDataSourceLinkageChange(asyncLinkageResult.values);
            },
          );
        }
      };

      if (isRegisteValueSyncLinkage) {
        const linkageResult = valueLinkageHandler(changedValues, values, [
          ...syncValueLinkageSortedRef.current.map((item) => item.linkage.linkage),
          ...(coreActionsRef.current.valueLinkage ?? []),
        ]);

        formRef.current?.setFieldsValue(linkageResult.changedValues);

        if (!isRegistedValueAsyncLinkage) {
          coreActionsRef.current.onValuesLinkageChange?.(
            linkageResult.changedValues,
            linkageResult.values,
          );
          coreActionsRef.current.onDataSourceLinkageChange(linkageResult.values);
        }

        asyncLinkageCount(linkageResult);
        return;
      }

      asyncLinkageCount({
        values,
        changedValues,
      });
    },
    [coreActionsRef],
  );

  const setFieldsValueAndTriggeLinkage = (changedValues?: RecordType) => {
    if (changedValues == null || Object.keys(changedValues).length === 0) return;
    form.setFieldsValue(changedValues);

    const values = form.getFieldsValue();
    const normalizedValues = normalizeFieldsValue(values);

    linkageChange({
      values,
      changedValues,
      normalizedValues,
    });
  };

  const formActionsRef = useActionsRef<OSFormAPI>({
    normalizeFieldsValue,
    setDataSource,
    getDataSource,
    validate,
    getFieldsValue: (nameList?: NamePath[] | true, filterFunc?: (meta: Meta) => boolean) =>
      nameList == null ? form.getFieldsValue() : form.getFieldsValue(nameList, filterFunc),
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
    /** 所有子组件都隐藏，则隐藏改行 */
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
  });

  const { requestInitialValuesLoading } = useAsyncInitialValues({
    actions: formActionsRef.current,
    requestInitialValues: requests?.requestInitialValues,
    asyncInitialValuesRef,
  });

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
    requestDataSource();
  }, []);

  useEffect(() => {
    formRef.current?.setFieldsValue(value);
  }, [value]);

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
          ...fieldItemSettings,
          ...staticSettings,
        };

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
          /** 所有子组件都隐藏了 */
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
              >
                {items.map((item, _index) => {
                  const renderCol = (child?: React.ReactNode) => {
                    const childrenSettings = Array.from(
                      /** type group 可能不提供任何 key */
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

                  /** 需要外面一个 Col 包裹来挂载一些信息 */
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
                props: options?.props,
                ref: leafFieldItemComponentRefRefs.current[keyIndexId].ref,
              },
            );
          },
          fieldItemSettings,
          baseFormItemSettings: settings?.formItemSettimgs,
          className: cls(
            mergedStaticSettings?.readonly ? 'readonly-form-item' : undefined,
            parentKeyIndexId_ == null && index === fieldItems_!.length - 1
              ? 'is-lastest-row-item'
              : undefined,
          ),
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

    /** 通过计数器进行 field-item 注册的联动规则排序 */
    const syncCounts = {};
    const asyncCounts = {};

    const statistic = (
      _settings: OSFormFieldItemWithStaticPureConfigs['settings'],
      keyIndexId: string,
      keyName: 'valueLinkage' | 'valueAsyncLinkage',
      counts: Record<string, number>,
    ) => {
      /** 这里即使是 asyncValueLinkage 没有定义 serical 也会初始化一次 key，后续以 count 便利是不会丢失的 */
      if (_settings?.[keyName]) {
        if (counts[keyIndexId] == null) {
          // eslint-disable-next-line no-param-reassign
          counts[keyIndexId] = 0;
        }

        const afterIndexId = (() => {
          if (keyName === 'valueLinkage') {
            return _settings?.[keyName]?.afterIndexIdRegisted;
          }
          return _settings?.[keyName]?.serial?.afterIndexIdRegisted;
        })();
        const afterIndexIds = (() => {
          if (Array.isArray(afterIndexId)) {
            return afterIndexId;
          }
          if (afterIndexId != null) {
            return [afterIndexId];
          }
          return [];
        })();

        afterIndexIds.forEach((afterKey) => {
          if (counts[afterKey] == null) {
            // eslint-disable-next-line no-param-reassign
            counts[afterKey] = 1;
          } else {
            // eslint-disable-next-line no-param-reassign
            counts[afterKey] += 1;
          }
        });
      }
    };

    Object.keys(keyIndexIdToStaticSettingsMapRef.current).forEach((keyIndexId) => {
      const _settings = keyIndexIdToStaticSettingsMapRef.current[keyIndexId];
      statistic(_settings, keyIndexId, 'valueAsyncLinkage', asyncCounts);
      statistic(_settings, keyIndexId, 'valueLinkage', syncCounts);
    });

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

  useEffect(() => {
    /** 解决初始化无法 hide 的问题 */
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
            name={name}
            ref={formRef}
            form={form}
            layout={settings?.layout ?? 'horizontal'}
            className={clsPrefix}
            labelCol={labelCol ?? { span: 10 }}
            wrapperCol={wrapperCol ?? { span: 14 }}
            initialValues={initialValues}
            onValuesChange={(changedValues, values) => {
              onValuesChange?.(changedValues, values);
              onChange?.(changedValues);

              coreActionsRef.current.onDataSourceChange(values);

              linkageChange({
                values,
                changedValues,
              });
            }}
          >
            {renderItems(_fieldItems)}
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

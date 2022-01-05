import type { FormInstance } from '@ty/antd';
import { Form } from '@ty/antd';
import utl from 'lodash';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import type { ReactNode } from 'react';
import React from 'react';
import OSFormItemBase from '../form-items/form-item-base';
import { getDataIndexId, getKeyIndexId } from '../table/utils';
import type {
  OSEditableTableFieldType,
  OSFormAPI,
  OSFormFieldItem,
  OSFormFieldItemWithStaticPureConfigs,
  OSFormItemType,
  OSLayoutFormAPI,
  OSLayoutModalFormAPI,
  OSLayoutTabsFormAPI,
  OSLayoutTabsFormType,
  OSTableAPI,
  RecordType,
  _OSFormFieldItemWithStaticPureConfigs,
} from '../../typings';
import {
  pickFieldRequests,
  pickFieldSettings,
  pickFormItemRequests,
  pickFormItemSettings,
} from './pick-field-item-settings';
import { tableCellErrorValidate } from './table-cell-error-validate';

export const renderFormItem = (
  valueType: OSFormFieldItem['type'],
  settings: OSFormFieldItem['settings'],
  requests: OSFormFieldItem['requests'],
  options: {
    formRef: React.MutableRefObject<FormInstance | null>;
    dependencies?: string[];
    getField?: (
      settings: OSFormFieldItemWithStaticPureConfigs['settings'],
      requests: OSFormFieldItemWithStaticPureConfigs['requests'],
      formItemSettings: OSFormItemType['settings'],
      formItemRequests: OSFormItemType['requests'],
      options?: {
        props?: RecordType;
        ref?: React.MutableRefObject<any>;
      },
    ) => ReactNode;
    baseFormItemSettings?: OSFormItemType['settings'];
    className?: string;
    fieldItemSettings?: _OSFormFieldItemWithStaticPureConfigs<OSEditableTableFieldType>['settings'];
    hideFormGroupItemDom?: (keyIndexId?: string) => void;
    showFormGroupItemDom?: (keyIndexId?: string) => void;
    actions: OSFormAPI;
    currentHideLeafKeyIndexIdSetRef: React.MutableRefObject<Set<string>>;
    currentVisibleLeafKeyIndexIdSetRef: React.MutableRefObject<Set<string>>;
    leafDataIndexIdToStaticPureConfigsMapRef: React.MutableRefObject<
      Record<string, OSFormFieldItemWithStaticPureConfigs>
    >;
    leafDataIndexIdToComponentRefRef: React.MutableRefObject<
      Record<string, React.RefObject<RecordType>>
    >;
    leafKeyIndexIdToDataIndexIdMapRef: React.MutableRefObject<Record<string, string>>;
    keyIndexIdToStaticSettingsMapRef: React.MutableRefObject<
      Record<string, OSFormFieldItemWithStaticPureConfigs['settings']>
    >;
  },
) => {
  const {
    dependencies,
    actions,
    leafDataIndexIdToStaticPureConfigsMapRef,
    currentHideLeafKeyIndexIdSetRef,
    currentVisibleLeafKeyIndexIdSetRef,
    leafKeyIndexIdToDataIndexIdMapRef,
    keyIndexIdToStaticSettingsMapRef,
    leafDataIndexIdToComponentRefRef,
  } = options;
  const renderContent = () => {
    const renderInner = (settings_: OSFormFieldItemWithStaticPureConfigs['settings']) => {
      const keyIndexId = getKeyIndexId(settings_?.key ?? settings_?.dataIndex);
      const dataIndexId = getDataIndexId(settings_?.dataIndex);

      leafKeyIndexIdToDataIndexIdMapRef.current[keyIndexId] = dataIndexId;

      const formItemSettings = pickFormItemSettings({
        ...options.fieldItemSettings,
        ...options.baseFormItemSettings,
        ...settings_,
      });
      const formItemRequests = pickFormItemRequests(requests);
      const fieldSettings = pickFieldSettings({ ...options.fieldItemSettings, ...settings_ });
      const fieldRequests = pickFieldRequests(requests);

      const mergedSettings = {
        ...formItemSettings,
        ...fieldSettings,
      };

      keyIndexIdToStaticSettingsMapRef.current[keyIndexId] = mergedSettings;

      if (settings_?.hide) {
        /** 联动需要通过 css 操作的方式来达到隐藏 col 的目的 */
        options?.hideFormGroupItemDom?.(keyIndexId);

        currentHideLeafKeyIndexIdSetRef.current.add(keyIndexId);
        currentVisibleLeafKeyIndexIdSetRef.current.delete(keyIndexId);

        return null;
      }

      /**
       * dataIndex 不是唯一键
       * 非 hide 的字段将覆盖历史 dataIndex
       * 必须在 hide 结束语句后返回
       */
      leafDataIndexIdToStaticPureConfigsMapRef.current[dataIndexId] = {
        dependencies,
        type: valueType,
        settings: mergedSettings,
        requests: {
          ...formItemRequests,
          ...fieldRequests,
        },
      } as OSFormFieldItemWithStaticPureConfigs;

      if (settings_?.hide === false) {
        options?.showFormGroupItemDom?.(keyIndexId);
      }

      currentVisibleLeafKeyIndexIdSetRef.current.add(keyIndexId);
      currentHideLeafKeyIndexIdSetRef.current.delete(keyIndexId);

      const fieldRef = React.createRef<OSTableAPI | OSLayoutFormAPI>();

      leafDataIndexIdToComponentRefRef.current[dataIndexId] = fieldRef;

      return (
        <OSFormItemBase
          className={options.className}
          validateTrigger={['onChange']}
          settings={((): OSFormItemType['settings'] => {
            if (valueType === 'editable-table' || valueType === 'attachment-table') {
              return {
                ...formItemSettings,
                rules: [
                  ...(formItemSettings.rules ?? []),
                  {
                    /**
                     * 手动提交的时候，主动触发验证
                     */
                    validateTrigger: [],
                    validator: async () => {
                      const api = fieldRef.current as OSTableAPI | undefined;
                      if (api) {
                        const { error, data } = await api?.validate();
                        if (error) {
                          const message = tableCellErrorValidate({
                            errorFields: (data as ValidateErrorEntity).errorFields,
                            dataSource: api.getVisualDataSource() ?? api.getDataSource(),
                            title: mergedSettings.title,
                          });

                          if (message.length) {
                            return Promise.reject(new Error(message));
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ],
              };
            }

            if (valueType === 'layout-modal-form' || valueType === 'form') {
              return {
                ...formItemSettings,
                rules: [
                  ...(formItemSettings.rules ?? []),
                  {
                    /**
                     * 将内部表单字段表格内部的错误上报上去
                     */
                    validateTrigger: [],
                    validator: async () => {
                      const api = fieldRef.current as OSLayoutModalFormAPI | OSFormAPI | undefined;
                      if (api?.validateRecursion) {
                        const { data, error } = await api.validateRecursion();
                        if (error) {
                          const message = (data as ValidateErrorEntity).errorFields
                            .filter((item) => item.errors.length)
                            .map((item) => {
                              return `${item.errors.join(', ')}`;
                            })
                            .join('; ');
                          if (message.length) {
                            return Promise.reject(new Error(message));
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ],
              };
            }

            if (valueType === 'layout-tabs-form') {
              return {
                ...formItemSettings,
                rules: [
                  ...(formItemSettings.rules ?? []),
                  {
                    /**
                     * 将内部表单字段表格内部的错误上报上去
                     */
                    validateTrigger: [],
                    validator: async () => {
                      const api = fieldRef.current as OSLayoutTabsFormAPI | undefined;
                      if (api?.validateRecursion) {
                        const { data, error } = await api.validateRecursion();
                        if (error) {
                          const tabs = utl.fromPairs(
                            (mergedSettings as OSLayoutTabsFormType['settings'])?.tabs?.map(
                              (item) => [item.key ?? item.title, item.title],
                            ),
                          );

                          const errorMsgs = Object.keys(
                            data as Record<string, ValidateErrorEntity | RecordType>,
                          )
                            .map((tabKey) => {
                              if (data[tabKey].errorFields) {
                                return `${tabs[tabKey] ?? ''}内${(
                                  data[tabKey] as ValidateErrorEntity
                                ).errorFields
                                  .map(
                                    (errorField) =>
                                      `${errorField.name}: ${errorField.errors.join(', ')}`,
                                  )
                                  .join(', ')}`;
                              }
                              return null;
                            })
                            .filter(Boolean);

                          if (errorMsgs.length) {
                            const message = errorMsgs.join('; ');
                            return Promise.reject(new Error(message));
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ],
              };
            }
            return formItemSettings;
          })()}
          requests={formItemRequests}
        >
          {options.getField?.(fieldSettings, fieldRequests, formItemSettings, formItemRequests, {
            ref: fieldRef,
          })}
        </OSFormItemBase>
      );
    };

    if (typeof settings === 'function') {
      return (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            dependencies
              ? dependencies.some((dependKey) => prevValues[dependKey] !== curValues[dependKey])
              : false
          }
        >
          {(form: FormInstance) => {
            return renderInner(settings({ form, actions }));
          }}
        </Form.Item>
      );
    }
    return renderInner(settings);
  };

  return renderContent();
};

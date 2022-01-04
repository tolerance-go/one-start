import type { FormInstance } from '@ty/antd';
import { Form } from '@ty/antd';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import type { ReactNode } from 'react';
import React from 'react';
import OSFormItemBase from '../form-items/form-item-base';
import type {
  OSFormItemType,
  OSLayoutFormAPI,
  OSLayoutModalFormAPI,
  OSTableAPI,
  OSTableFormFieldItems,
  OSTableFormFieldItemWithStaticPureConfigs,
  RecordType,
} from '../typings';
import { normalizeDataIndex } from './normalize-data-index';
import {
  pickFieldRequests,
  pickFieldSettings,
  pickFormItemSettings,
  pickTableFormItemRequests,
} from './pick-field-item-settings';

export const renderTableFormItem = (
  valueType: OSTableFormFieldItems[number]['type'],
  settings: OSTableFormFieldItems[number]['settings'],
  requests: RecordType,
  options: {
    dataSource?: RecordType[];
    formItemClassName?: string;
    rowIndex?: number;
    rowData?: Record<string, any>;
    rowId?: string;
    dependencies?: string[];
    actions: OSTableAPI;
    getField?: (
      settings: OSTableFormFieldItemWithStaticPureConfigs['settings'],
      requests: OSTableFormFieldItemWithStaticPureConfigs['requests'],
      formItemSettings: OSTableFormFieldItemWithStaticPureConfigs['settings'],
      formItemRequests: OSTableFormFieldItemWithStaticPureConfigs['requests'],
      options?: {
        props?: RecordType;
        ref?: React.MutableRefObject<any>;
      },
    ) => ReactNode;
    renderFormItem?: OSFormItemType['renderFormItem'];
    defaultSettings?: OSTableFormFieldItemWithStaticPureConfigs['settings'];
  },
) => {
  const {
    dataSource,
    rowIndex,
    rowData,
    rowId,
    dependencies,
    actions,
    renderFormItem: _renderFormItem,
    defaultSettings,
    formItemClassName,
  } = options;

  const renderContent = () => {
    const renderInner = (settings_: OSTableFormFieldItemWithStaticPureConfigs['settings']) => {
      const mergedSettings = { ...defaultSettings, ...(settings_ ?? {}) };

      const { dataIndex } = mergedSettings;
      const formItemSettings = pickFormItemSettings(mergedSettings);
      const formItemRequests = pickTableFormItemRequests(requests);
      const fieldSettings = pickFieldSettings(mergedSettings);
      const fieldRequests = pickFieldRequests(requests);

      const fieldRef = React.createRef<OSTableAPI | OSLayoutFormAPI>();

      return (
        <OSFormItemBase
          className={formItemClassName}
          validateTrigger={(() => {
            if (valueType === 'layout-modal-form') {
              return ['onFieldsValidated'];
            }
            return ['onChange'];
          })()}
          settings={((): OSFormItemType['settings'] => {
            const common = {
              ...formItemSettings,
              styles: {
                ...formItemSettings.styles,
                marginBottom: 0,
              },
              dataIndex: (rowId == null ? [] : [rowId]).concat(
                normalizeDataIndex(dataIndex).join('.'),
              ),
            };

            if (valueType === 'layout-modal-form') {
              return {
                /** 手动执行 validate 会触发所有 rules 规则 */
                validateFirst: true,
                ...common,
                rules: [
                  ...(formItemSettings.rules ?? []),
                  {
                    /**
                     * 将内部表单字段表格内部的错误上报上去
                     */
                    validateTrigger: [],
                    validator: async () => {
                      const api = fieldRef.current as OSLayoutModalFormAPI | undefined;
                      if (api?.validate) {
                        const { data, error } = await api.validate();
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
            return common;
          })()}
          requests={formItemRequests}
          renderFormItem={_renderFormItem}
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
            return renderInner(settings({ dataSource, form, rowIndex, rowData, rowId, actions }));
          }}
        </Form.Item>
      );
    }
    return renderInner(settings);
  };

  return renderContent();
};

import { LoadingOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Form, Spin, Tooltip } from '@ty/antd';
import type { Rule, RuleObject } from '@ty/antd/lib/form';
import type { ValidateStatus } from '@ty/antd/lib/form/FormItem';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormInstanceContext } from '../providers/form-context';
import type { OSFormItemTooltip, OSFormItemType, OSRule } from '../typings';
import { normalizeDataIndex } from '../utils/normalize-data-index';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import InlineErrorFormItem from './inner-error-form-item';
import { getDateCheckRule } from './rules/get-date-check-rule';
import { getNumberDigitsRule } from './rules/get-number-digits-rule';
import { getNumberRangeRule } from './rules/get-number-range-rule';
import { getTradingDaysRule } from './rules/get-trading-days-rule';
import { mergeRuleToTooltip, normalizeTooltip } from './utils';

const OSFormItemBase: React.FC<OSFormItemType> = (props) => {
  const { settings, requests, noStyle, className, validateTrigger } = props;
  const {
    tooltip,
    rules,
    warningRules,
    title,
    dataIndex,
    initialValue,
    labelCol,
    wrapperCol,
    linkagetip,
    validateFirst,
  } = settings ?? {};

  const formInstaceRefCtx = useContext(FormInstanceContext);

  const [requestFormItemValueLoading, setRequestFormItemValueLoading] = useState(false);
  const [requestInitialValueLoading, setRequestInitialValueLoading] = useState(false);

  const requestFormItemValue = async () => {
    if (!requests?.requestFormItemValue) return;

    setRequestFormItemValueLoading(true);
    const { error, data } = await requests.requestFormItemValue().then(normalizeRequestOutputs);
    setRequestFormItemValueLoading(false);

    if (error) return;

    formInstaceRefCtx.current?.setFieldsValue({
      [normalizeDataIndex(dataIndex).toString()]: data,
    });
  };

  const [asyncInitialValue, setAsyncInitialValue] = useState();

  const requestInitialValue = async () => {
    if (!requests?.requestInitialValue) return;

    setRequestInitialValueLoading(true);
    const { error, data } = await requests
      .requestInitialValue({
        value: dataIndex ? formInstaceRefCtx.current?.getFieldValue(dataIndex) : undefined,
      })
      .then(normalizeRequestOutputs);
    setRequestInitialValueLoading(false);

    if (error) return;

    formInstaceRefCtx.current?.setFieldsValue({
      [normalizeDataIndex(dataIndex).toString()]: data,
    });
    setAsyncInitialValue(data);
  };

  useEffect(() => {
    requestFormItemValue();
    requestInitialValue();
  }, []);

  const [help, setHelp] = useState<string>();
  const [validateStatus, setValidateStatus] = useState<ValidateStatus>();

  const convertOsRule = (item: Rule | OSRule): Rule => {
    if ((item as OSRule).ruleType) {
      const osRule = item as OSRule;
      if (osRule.ruleType === 'digital-accuracy') {
        return getNumberDigitsRule({
          integersMaxLen: osRule.settings?.integersMaxLen,
          floatsMaxLen: osRule.settings?.floatsMaxLen,
        });
      }
      if (osRule.ruleType === 'date-check') {
        return getDateCheckRule({
          dataIndex: osRule.settings?.dataIndex,
          date: osRule.settings?.date,
          type: osRule.settings.type,
          dateLabel: osRule.settings?.dateLabel,
          granularity: osRule.settings?.granularity,
        });
      }
      if (osRule.ruleType === 'digital-scope') {
        return getNumberRangeRule({
          min: osRule.settings?.min,
          max: osRule.settings?.max,
          minDataIndex: osRule.settings?.minDataIndex,
          maxDataIndex: osRule.settings?.maxDataIndex,
          minDataLabel: osRule.settings?.minDataLabel,
          maxDataLabel: osRule.settings?.maxDataLabel,
          minType: osRule.settings?.minType,
          maxType: osRule.settings?.maxType,
        });
      }
      if (osRule.ruleType === 'trading-day-check') {
        return getTradingDaysRule({
          request: osRule?.requests?.requestValidate,
        });
      }
    }
    return item as Rule;
  };

  const prevInputValueRef = useRef();

  const wrapWarningRules = () => {
    return (
      rules?.map((item): Rule => {
        return convertOsRule(item);
      }) ?? []
    ).concat(
      warningRules
        ?.map((item): Rule => {
          return convertOsRule(item);
        })
        ?.map((item) => {
          return (form) => {
            const wrapRule = (item_: RuleObject): RuleObject => {
              const { validator, validateTrigger: validateTrigger_ } = item_;
              return {
                validator: (rule, value, callback) => {
                  return new Promise((resolve, reject) => {
                    if (validator) {
                      try {
                        if (prevInputValueRef.current !== value) {
                          setHelp(undefined);
                          setValidateStatus(undefined);
                        }
                        prevInputValueRef.current = value;

                        // setValidateStatus('validating');
                        // setRequestFormItemValueLoading(true);
                        const result = validator(rule, value, callback);

                        if (result instanceof Promise) {
                          result
                            .then(() => {
                              // setValidateStatus(undefined)
                              // setRequestFormItemValueLoading(false);
                              resolve(true);
                            })
                            .catch((error: Error) => {
                              /**
                               * 1. 所有 error 会在 warn 之前执行
                               * 2. form item 出现一个 error 不会暂停后续的
                               * 3. 所有 warn 本质是一个必定成功的 rule
                               * 4. warn 使用了 validateStatus 受控，优先级最高
                               *
                               * settimeout 执行时，错误信息已经可以获取
                               * */
                              setTimeout(() => {
                                if (dataIndex) {
                                  const validateError = form.getFieldsError([dataIndex]);
                                  if (validateError.some((data) => data.errors.length > 0)) {
                                    return;
                                  }
                                }
                                setHelp(error.message);
                                setValidateStatus('warning');
                                // setRequestFormItemValueLoading(false);
                              });
                              resolve(true);
                            });
                          return;
                        }
                      } catch (error) {
                        reject(error);
                      }
                    }
                    resolve(true);
                  });
                },
                validateTrigger: validateTrigger_,
              };
            };

            if (typeof item === 'function') {
              return wrapRule(item(form));
            }

            return wrapRule(item);
          };
        }) ?? [],
    );
  };

  const FormItemType = settings?.inlineError ? InlineErrorFormItem : Form.Item;

  const normalizedTooltip = useMemo((): OSFormItemTooltip | undefined => {
    return normalizeTooltip(tooltip);
  }, [tooltip]);

  const mergedTooltip = useMemo(() => {
    return mergeRuleToTooltip(rules, normalizedTooltip);
  }, [rules, normalizedTooltip]);

  if (settings?.hide) {
    return null;
  }

  const label = linkagetip ? (
    <span>
      {title}
      <Tooltip
        title={
          Array.isArray(linkagetip) ? (
            <div>
              {linkagetip.map((item) => (
                <div>{item}</div>
              ))}
            </div>
          ) : (
            linkagetip
          )
        }
      >
        <ThunderboltOutlined
          style={{
            marginLeft: 4,
            color: 'rgba(0, 0, 0, 0.45)',
            fontSize: 12,
            cursor: 'help',
          }}
        />
      </Tooltip>
    </span>
  ) : (
    title
  );

  /** React.ReactNode 类型的 title 不会自动出现在 rule 提示中，提供一个特殊的 title */
  const messageVariables = title
    ? {
        label: title,
      }
    : undefined;

  const dom = (
    <Spin
      indicator={<LoadingOutlined />}
      spinning={requestFormItemValueLoading || requestInitialValueLoading}
    >
      <FormItemType
        validateTrigger={validateTrigger}
        validateFirst={validateFirst}
        preserve={settings?.preserve}
        className={className}
        style={{
          ...settings?.styles,
          flexWrap: 'nowrap',
        }}
        help={help}
        validateStatus={validateStatus}
        key={asyncInitialValue && JSON.stringify(asyncInitialValue)}
        noStyle={noStyle}
        tooltip={
          mergedTooltip.title?.length
            ? {
                title: (
                  <div>
                    {mergedTooltip.title.map((item) => (
                      <div>{item}</div>
                    ))}
                  </div>
                ),
                overlayStyle: mergedTooltip.overlayStyle,
                color: mergedTooltip.color,
              }
            : undefined
        }
        rules={wrapWarningRules()}
        label={label}
        name={dataIndex}
        initialValue={asyncInitialValue ?? initialValue}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        messageVariables={messageVariables}
      >
        {props.children}
      </FormItemType>
    </Spin>
  );

  if (props.renderFormItem) {
    return <>{props.renderFormItem?.(dom, props)}</>;
  }

  return dom;
};

export default OSFormItemBase;

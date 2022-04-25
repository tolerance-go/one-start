import { LoadingOutlined } from '@ant-design/icons';
import { Col, Divider, Form, Row, Spin, Steps } from 'antd';
import cls from 'classnames';
import utl from 'lodash';
import type { NamePath } from 'rc-field-form/es/interface';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type {
  AbstractItem,
  OSFormAPI,
  OSLayoutStepsFormAPI,
  OSLayoutStepsFormType,
  RecordType,
} from '@ty-one-start/typings';
import OSForm from '../../form';
import { useActionsRef } from '@ty-one-start/utils';
import { OSTrigger } from '@ty-one-start/triggers';
import { logRequestMessage } from '@ty-one-start/utils';
import { normalizeRequestOutputs } from '@ty-one-start/utils';
import { useClsPrefix } from '@ty-one-start/utils';
import { useLoading } from '@ty-one-start/utils';
import { useRequestInitialValues } from './use-request-initial-values';

const OSLayoutStepsForm: React.ForwardRefRenderFunction<
  OSLayoutStepsFormAPI,
  OSLayoutStepsFormType
> = (props, ref) => {
  const { settings, requests, value, onChange } = props;

  const { steps, forms, submitTriggerText, defaultCurrent } = settings ?? {};
  const [current, setCurrent] = useState(defaultCurrent ?? 0);

  const { requestWhenSubmit, requestWhenNext, requestInitialValues } = requests ?? {};
  const asyncInitialValuesRef = useRef<RecordType>();

  const clsPrefix = useClsPrefix('layouttabs-form');
  const formsRef = useRef<React.MutableRefObject<OSFormAPI | null>[]>([]);
  const requestDataSourceLoading = useLoading();

  const getItemKey = (item: AbstractItem) => {
    return item.key ?? item.title;
  };

  const indexKeysMap = useMemo(() => {
    return utl.reduce(
      steps,
      (colt, next, index) => {
        return {
          ...colt,
          [index]: getItemKey(next) ?? index,
        };
      },
      {},
    );
  }, [steps]);

  /**
   * 函数形式获取，避免 formsRef 为空
   * 比如表单是单独放在 dialog 内部存在
   */
  const getCurrentFormInstance = () => {
    return formsRef.current[current]?.current;
  };

  const resetTargetFormFields = (formInstance: OSFormAPI | null, index: number) => {
    const formKey = indexKeysMap[index];

    formInstance?.resetFields();

    if (asyncInitialValuesRef.current?.[formKey]) {
      formInstance?.setFieldsValue(asyncInitialValuesRef.current?.[formKey]);
    }
  };

  const resetFields = () => {
    resetTargetFormFields(getCurrentFormInstance(), current);
  };

  const resetFormsFields = () => {
    formsRef.current.forEach((formRef, index) => {
      resetTargetFormFields(formRef.current, index);
    });
  };

  const getFieldsValue = () => {
    return utl.fromPairs(
      formsRef.current.map((__, index) => [
        indexKeysMap[index],
        formsRef.current[index].current!.getFieldsValue(),
      ]),
    );
  };

  const getDataSource = () => {
    return utl.fromPairs(
      formsRef.current.map((__, index) => [
        indexKeysMap[index],
        formsRef.current[index].current!.getDataSource(),
      ]),
    );
  };

  const setDataSource = (values?: RecordType) => {
    if (!values) return;
    formsRef.current.forEach((__, index) => {
      formsRef.current[index].current?.setFieldsValue(values[indexKeysMap[index]]);
    });
    onChange?.(values);
  };

  const setFieldsValue = (values?: RecordType) => {
    if (!values) return;
    formsRef.current.forEach((__, index) => {
      formsRef.current[index].current?.setFieldsValue(values[indexKeysMap[index]]);
    });
  };

  const getFieldsError = (tabKey?: string, nameList?: NamePath[]) => {
    return utl.fromPairs(
      formsRef.current
        .map((formRef, index) => ({
          index,
          formKey: indexKeysMap[index],
          formRef,
        }))
        .filter((item) => (tabKey ? tabKey === item.formKey : true))
        .map((item) => [
          item.formKey,
          formsRef.current[item.index].current!.getFieldsError(nameList),
        ]),
    );
  };

  const validateBase = async (index: number, recursion?: boolean) => {
    const result = await formsRef.current[index].current![
      recursion ? 'validateRecursion' : 'validate'
    ]();

    return result;
  };

  const validate = async () => {
    return validateBase(current);
  };

  const validateRecursion = async () => {
    return validateBase(current, true);
  };

  const requestDataSource = async () => {
    if (!requests?.requestStepsFormDataSource) {
      return;
    }

    requestDataSourceLoading.switch();
    const { error, data } = await requests
      .requestStepsFormDataSource({
        // TODO
        actions: {} as any,
      })
      .then(normalizeRequestOutputs);
    requestDataSourceLoading.switch();

    if (error) return;

    setFieldsValue(data);
  };

  const clearPrevUserCellInputs = () => {
    Object.keys(formsRef.current).forEach((formKey) =>
      formsRef.current[formKey].current!.clearPrevUserCellInputs(),
    );
  };

  const coreActionsRef = useActionsRef({
    clearPrevUserCellInputs,
    validateRecursion,
    setDataSource,
    getDataSource,
    validate,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    getFieldsError,
  });

  const { requestInitialValuesLoading } = useRequestInitialValues({
    apis: coreActionsRef.current,
    requestInitialValues,
    asyncInitialValuesRef,
  });

  useImperativeHandle(ref, () => {
    return {
      clearPrevUserCellInputs,
      validateRecursion,
      setDataSource,
      getDataSource,
      validate,
      getFieldsValue,
      setFieldsValue,
      resetFields,
      getFieldsError,
    };
  });

  useEffect(() => {
    coreActionsRef.current.setFieldsValue(value);
  }, [value, coreActionsRef]);

  useEffect(() => {
    requestDataSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form.Provider>
      <Spin
        spinning={requestInitialValuesLoading || requestDataSourceLoading.loading}
        indicator={<LoadingOutlined />}
      >
        <Steps type="navigation" className={cls(clsPrefix)} current={current}>
          {steps?.map((item, index) => {
            const key = getItemKey(item) ?? index;
            return <Steps.Step key={key} title={<span>{item.title}</span>}></Steps.Step>;
          })}
        </Steps>
        <div style={{ marginTop: 15 }}>
          {steps?.map((item, index) => {
            const key = getItemKey(item) ?? index.toString();

            const formConfigs = forms?.[key];
            const formRef = React.createRef<OSFormAPI>();
            formsRef.current[index] = formRef;

            return (
              <div
                key={key}
                style={{
                  display: current === index ? 'block' : 'none',
                }}
              >
                {formConfigs && (
                  <OSForm
                    name={key}
                    ref={formRef}
                    {...formConfigs}
                    onChange={() => {
                      onChange?.(getFieldsValue());
                    }}
                  ></OSForm>
                )}
              </div>
            );
          })}
        </div>
        {steps?.length ? (
          <>
            <Divider
              style={{
                margin: '15px 0 10px 0',
              }}
            />
            <Row gutter={5} justify="end" align="middle">
              <Col>
                <OSTrigger
                  type="button"
                  settings={{
                    text: '重置',
                  }}
                  onClick={() => {
                    resetFields();
                  }}
                />
              </Col>
              {current > 0 ? (
                <Col>
                  <OSTrigger
                    type="button"
                    settings={{
                      text: '上一步',
                    }}
                    requests={{
                      requestAfterClick: async () => {
                        if (current > 0) {
                          setCurrent((prev) => prev - 1);
                        }
                        return false;
                      },
                    }}
                  />
                </Col>
              ) : null}
              <Col>
                <OSTrigger
                  type="button"
                  settings={{
                    type: 'primary',
                    text: (() => {
                      if (current === steps.length - 1) {
                        return submitTriggerText ?? '确认提交';
                      }
                      return '下一步';
                    })(),
                  }}
                  requests={{
                    requestAfterClick: async () => {
                      if (current <= steps.length - 1) {
                        const { error, data } = await validate();

                        if (error) {
                          return true;
                        }

                        if (current === steps.length - 1) {
                          if (requestWhenSubmit) {
                            const submitRsp = await requestWhenSubmit({
                              values: getFieldsValue(),
                            })
                              .then(normalizeRequestOutputs)
                              .then(logRequestMessage());

                            if (submitRsp.error) {
                              return true;
                            }

                            resetFormsFields();
                            setCurrent(0);

                            return false;
                          }
                        } else {
                          if (requestWhenNext) {
                            const rsp = await requestWhenNext({
                              current,
                              values: getFieldsValue(),
                              currentValues: data,
                              formsRef,
                            })
                              .then(normalizeRequestOutputs)
                              .then(logRequestMessage());

                            if (rsp.error) {
                              return true;
                            }
                          }

                          setCurrent((prev) => prev + 1);
                        }
                      }
                      return false;
                    },
                  }}
                />
              </Col>
            </Row>
          </>
        ) : null}
      </Spin>
    </Form.Provider>
  );
};

export default React.forwardRef(OSLayoutStepsForm);

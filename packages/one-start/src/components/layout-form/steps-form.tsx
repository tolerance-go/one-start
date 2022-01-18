import { LoadingOutlined } from '@ant-design/icons';
import { Col, Form, Row, Spin, Steps } from '@ty/antd';
import cls from 'classnames';
import utl from 'lodash';
import type { NamePath } from 'rc-field-form/lib/interface';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useActionsRef } from '../hooks/use-actions-ref';
import type {
  AbstractItem,
  OSFormAPI,
  OSLayoutStepsFormAPI,
  OSLayoutStepsFormType,
  RecordType,
} from '../../typings';
import OSForm from '../form';
import OSTrigger from '../trigger';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useLoading } from '../utils/use-loading';
import { logRequestMessage } from '../utils/log-request-message';

const OSLayoutStepsForm: React.ForwardRefRenderFunction<
  OSLayoutStepsFormAPI,
  OSLayoutStepsFormType
> = (props, ref) => {
  const { settings, requests, value, onChange } = props;
  const [current, setCurrent] = useState(0);

  const { steps, forms } = settings ?? {};

  const { requestWhenSubmit } = requests ?? {};

  const clsPrefix = useClsPrefix('layouttabs-form');
  const osFormsRef = useRef<React.MutableRefObject<OSFormAPI | null>[]>([]);
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

  const currentFormInstance = (() => {
    return osFormsRef.current[current]?.current;
  })();

  const resetFields = () => {
    currentFormInstance?.resetFields();
  };

  const resetStepFormsFields = () => {
    osFormsRef.current.forEach((formRef) => formRef.current?.resetFields());
  };

  const getFieldsValue = () => {
    return utl.fromPairs(
      osFormsRef.current.map((__, index) => [
        indexKeysMap[index],
        osFormsRef.current[index].current!.getFieldsValue(),
      ]),
    );
  };

  const getDataSource = () => {
    return utl.fromPairs(
      osFormsRef.current.map((__, index) => [
        indexKeysMap[index],
        osFormsRef.current[index].current!.getDataSource(),
      ]),
    );
  };

  const setDataSource = (values?: RecordType) => {
    if (!values) return;
    osFormsRef.current.forEach((__, index) => {
      osFormsRef.current[index].current?.setFieldsValue(values[indexKeysMap[index]]);
    });
    onChange?.(values);
  };

  const setFieldsValue = (values?: RecordType) => {
    if (!values) return;
    osFormsRef.current.forEach((__, index) => {
      osFormsRef.current[index].current?.setFieldsValue(values[indexKeysMap[index]]);
    });
  };

  const getFieldsError = (tabKey?: string, nameList?: NamePath[]) => {
    return utl.fromPairs(
      osFormsRef.current
        .map((formRef, index) => ({
          index,
          formKey: indexKeysMap[index],
          formRef,
        }))
        .filter((item) => (tabKey ? tabKey === item.formKey : true))
        .map((item) => [
          item.formKey,
          osFormsRef.current[item.index].current!.getFieldsError(nameList),
        ]),
    );
  };

  const validateBase = async (index: number, recursion?: boolean) => {
    const result = await osFormsRef.current[index].current![
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
    Object.keys(osFormsRef.current).forEach((formKey) =>
      osFormsRef.current[formKey].current!.clearPrevUserCellInputs(),
    );
  };

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

  const coreActionsRef = useActionsRef({
    setFieldsValue,
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
      <Spin spinning={requestDataSourceLoading.loading} indicator={<LoadingOutlined />}>
        <Steps
          size="small"
          type="navigation"
          className={cls(clsPrefix)}
          current={current}
          onChange={setCurrent}
        >
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
            osFormsRef.current[index] = formRef;

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
          <Row
            gutter={10}
            style={{
              marginTop: 15,
            }}
            justify="center"
            align="middle"
          >
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
                        const { error } = await validate();

                        if (error) {
                          return true;
                        }

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
                      return '确认提交';
                    }
                    return '下一步';
                  })(),
                }}
                requests={{
                  requestAfterClick: async () => {
                    if (current <= steps.length - 1) {
                      const { error } = await validate();

                      if (error) {
                        return true;
                      }

                      if (current === steps.length - 1) {
                        if (requestWhenSubmit) {
                          const submitRsp = await requestWhenSubmit({
                            values: getFieldsValue(),
                          })
                            .then(normalizeRequestOutputs)
                            .then(logRequestMessage('提交成功'));

                          if (submitRsp.error) {
                            return true;
                          }

                          resetStepFormsFields();
                          setCurrent(0);

                          return false;
                        }
                      } else {
                        setCurrent((prev) => prev + 1);
                      }
                    }
                    return false;
                  },
                }}
              />
            </Col>
          </Row>
        ) : null}
      </Spin>
    </Form.Provider>
  );
};

export default React.forwardRef(OSLayoutStepsForm);

import { DownOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Form, Spin, Tabs } from 'antd';
import cls from 'classnames';
import EventEmitter from 'eventemitter3';
import invariant from 'invariant';
import utl from 'lodash';
import type { NamePath } from 'rc-field-form/es/interface';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type {
  OSFormAPI,
  OSLayoutTabsFormAPI,
  OSLayoutTabsFormType,
  RecordType,
} from '@ty-one-start/typings';
import { normalizeRequestOutputs } from '@ty-one-start/utils';
import { useClsPrefix } from '@ty-one-start/utils';
import { useLoading } from '@ty-one-start/utils';
import { useUpdateEffect } from '@ty-one-start/utils';
import { LayoutTabsFormEventBusContext } from '@ty-one-start/provider';
import { FormItem } from './form-item';

const OSLayoutTabsForm: React.ForwardRefRenderFunction<OSLayoutTabsFormAPI, OSLayoutTabsFormType> =
  (props, ref) => {
    const { settings, requests, value, onChange, tabClassName } = props;
    const [activeKey, setActiveKey] = useState(() => {
      return settings?.tabs?.[0].key ?? settings?.tabs?.[0].title ?? '';
    });
    const [eventBus] = useState(new EventEmitter());

    const { tabs, forms, collapsable } = settings ?? {};

    const [validateError, setValidateError] = useState<Record<string, boolean>>({});

    const [collapse, setCollapse] = useState(false);

    const clsPrefix = useClsPrefix('layouttabs-form');
    const osFormsRef = useRef<Record<string, React.MutableRefObject<OSFormAPI | null>>>({});
    const requestDataSourceLoading = useLoading();

    const renderCollapse = () => {
      if (collapsable == null) return undefined;
      return React.createElement(collapse ? RightOutlined : DownOutlined, {
        onClick: () => {
          setCollapse((prev) => !prev);
        },
      });
    };

    const resetFields = () => {
      Object.keys(osFormsRef.current).map((formKey) => [
        formKey,
        osFormsRef.current[formKey].current!.resetFields(),
      ]);
    };

    const getFieldsValue = () => {
      return utl.fromPairs(
        Object.keys(osFormsRef.current).map((formKey) => [
          formKey,
          osFormsRef.current[formKey].current!.getFieldsValue(),
        ]),
      );
    };

    const getDataSource = () => {
      return utl.fromPairs(
        Object.keys(osFormsRef.current).map((formKey) => [
          formKey,
          osFormsRef.current[formKey].current!.getDataSource(),
        ]),
      );
    };

    const setDataSource = (values?: RecordType) => {
      if (!values) return;
      Object.keys(osFormsRef.current).forEach((formKey) => {
        osFormsRef.current[formKey].current?.setFieldsValue(values[formKey]);
      });
      onChange?.(values);
    };

    const setFieldsValue = (values?: RecordType) => {
      if (!values) return;
      Object.keys(osFormsRef.current).forEach((formKey) => {
        osFormsRef.current[formKey].current?.setFieldsValue(values[formKey]);
      });
    };

    const getFieldsError = (tabKey?: string, nameList?: NamePath[]) => {
      return utl.fromPairs(
        Object.keys(osFormsRef.current)
          .filter((key) => (tabKey ? tabKey === key : true))
          .map((formKey) => [
            formKey,
            osFormsRef.current[formKey].current!.getFieldsError(nameList),
          ]),
      );
    };

    const validateBase = async (recursion?: boolean) => {
      const results = await Promise.all(
        Object.keys(osFormsRef.current).map((formKey) =>
          osFormsRef.current[formKey]
            .current![recursion ? 'validateRecursion' : 'validate']()
            .then((result) => ({ formKey, result })),
        ),
      );

      const errors = results
        .map((item) => [item.formKey, item.result.error] as [string, boolean])
        .filter((item) => item[1]);

      if (errors.length) {
        setActiveKey(errors[0][0]);
        setValidateError(utl.fromPairs(errors));
      }

      const data = results.reduce((acc, next) => {
        return {
          ...acc,
          [next.formKey]: next.result.data,
        };
      }, {});

      return {
        error: errors.length > 0,
        data,
      };
    };

    const validate = async () => {
      return validateBase();
    };

    const validateRecursion = async () => {
      return validateBase(true);
    };

    const requestDataSource = async () => {
      if (!requests?.requestTabsFormDataSource) {
        return;
      }

      requestDataSourceLoading.switch();
      const { error, data } = await requests
        .requestTabsFormDataSource({
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

    useEffect(() => {
      setFieldsValue(value);
    }, [value]);

    useEffect(() => {
      requestDataSource();
    }, []);

    const onFieldsValidateError = (key: string) => {
      setValidateError((prev) => ({ ...prev, [key]: true }));
    };

    const onFieldsValidatePassed = (key: string) => {
      setValidateError((prev) => ({ ...prev, [key]: false }));
    };

    const triggerFieldValidate: (formKey: string) => FormProps['onFieldsChange'] =
      (formKey) => (changedFields, fields) => {
        /**
         * ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
         * Trigger value change
         * Rule validating
         * Rule validated
         * ??????????????????????????? isFieldValidating ????????? false > true > false ??????????????????
         * ?????????????????????????????? Trigger value change -> Rule validated
         * onValuesChange ????????? onFieldsChange ????????????
         */
        const isValidating = fields.some((item) => item.validating);

        if (!isValidating) {
          const isError = fields.some((item) => item.errors?.length);
          if (isError) {
            onFieldsValidateError?.(formKey);
          } else {
            onFieldsValidatePassed?.(formKey);
          }
        }
      };

    useUpdateEffect(() => {
      eventBus?.emit('layout-tabs-form-appear', activeKey);
    }, [activeKey]);

    return (
      <LayoutTabsFormEventBusContext.Provider value={eventBus}>
        <Form.Provider>
          <Spin spinning={requestDataSourceLoading.loading} indicator={<LoadingOutlined />}>
            <Tabs
              className={cls(clsPrefix, tabClassName, {
                collapse,
              })}
              tabBarExtraContent={renderCollapse()}
              activeKey={activeKey}
              onChange={setActiveKey}
            >
              {tabs?.map((item) => {
                const key = item.key ?? item.title;

                invariant(key, 'key ????????????');

                const formConfigs = forms?.[key];
                const formRef = React.createRef<OSFormAPI>();
                osFormsRef.current[key] = formRef;

                return (
                  <Tabs.TabPane
                    forceRender
                    destroyInactiveTabPane={false}
                    key={key}
                    tab={
                      <span
                        style={{
                          color: validateError[key] ? '#ff4d4f' : undefined,
                        }}
                      >
                        {item.title}
                      </span>
                    }
                  >
                    {formConfigs && (
                      <FormItem
                        formKey={key}
                        formRef={formRef}
                        formConfigs={{
                          ...formConfigs,
                          onChange: (data?: RecordType) => {
                            /** ?????? value ??? tabs form value */
                            const tabsValue = getFieldsValue();
                            onChange?.({
                              ...tabsValue,
                              [key]: {
                                ...tabsValue[key],
                                ...data,
                              },
                            });
                          },
                          onFieldsChange: triggerFieldValidate(key),
                        }}
                      />
                    )}
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </Spin>
        </Form.Provider>
      </LayoutTabsFormEventBusContext.Provider>
    );
  };

export default React.forwardRef(OSLayoutTabsForm);

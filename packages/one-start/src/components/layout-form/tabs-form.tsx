import { LoadingOutlined, RightOutlined, DownOutlined } from '@ant-design/icons';
import { Form, Spin, Tabs } from '@ty/antd';
import invariant from 'invariant';
import utl from 'lodash';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import OSForm from '../form';
import type { OSLayoutTabsFormAPI, OSLayoutTabsFormType, RecordType } from '../typings';
// import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { OSFormAPI } from '../typings/form';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useLoading } from '../utils/use-loading';
import cls from 'classnames';
import { NamePath } from 'rc-field-form/lib/interface';

const OSLayoutTabsForm: React.ForwardRefRenderFunction<OSLayoutTabsFormAPI, OSLayoutTabsFormType> =
  (props, ref) => {
    const { settings, requests, value, onChange } = props;
    const [activeKey, setActiveKey] = useState(() => {
      return settings?.tabs?.[0].key ?? settings?.tabs?.[0].title ?? '';
    });

    const clsPrefix = useClsPrefix('layouttabs-form');
    const osFormsRef = useRef<Record<string, React.MutableRefObject<OSFormAPI | null>>>({});
    const { tabs, forms, collapsable } = settings ?? {};

    const [validateError, setValidateError] = useState<Record<string, boolean>>({});

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
        osFormsRef.current[formKey].current!.setFieldsValue(values[formKey]);
      });
      onChange?.(values);
    };

    const setFieldsValue = (values?: RecordType) => {
      if (!values) return;
      Object.keys(osFormsRef.current).forEach((formKey) => {
        osFormsRef.current[formKey].current!.setFieldsValue(values[formKey]);
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

    const validateForms = async () => {
      const results = await Promise.all(
        Object.keys(osFormsRef.current).map((formKey) =>
          osFormsRef.current[formKey].current!.validate().then((result) => ({ formKey, result })),
        ),
      );

      const errors = results
        .map((item) => [item.formKey, item.result.error] as [string, boolean])
        .filter((item) => item[1]);
      if (errors.length) {
        setActiveKey(errors[0][0]);
        setValidateError(utl.fromPairs(errors));
      }
      return results.reduce(
        (obj, { formKey, result }) => ({
          ...obj,
          [formKey]: result,
        }),
        {},
      );
    };

    const requestDataSourceLoading = useLoading();

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

    const testValidateError = utl.debounce(() => {
      setTimeout(() => {
        const errors = Object.keys(osFormsRef.current).map((formKey) => {
          return [
            formKey,
            osFormsRef.current[formKey]?.current
              ?.getFieldsError()
              .some((item) => item.errors.length),
          ];
        });
        setValidateError(utl.fromPairs(errors));
      });
    }, 200);

    useImperativeHandle(ref, () => {
      return {
        setDataSource,
        getDataSource,
        validate: validateForms,
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

    const [collapse, setCollapse] = useState(false);

    const renderCollapse = () => {
      if (collapsable == null) return undefined;
      return React.createElement(collapse ? RightOutlined : DownOutlined, {
        onClick: () => {
          setCollapse((prev) => !prev);
        },
      });
    };

    /** 避免在表单中存在的时候，高频的触发字段验证 */
    const handleChangeValues = onChange ? utl.debounce(onChange, 400) : undefined;

    return (
      <Form.Provider
        onFormChange={() => {
          testValidateError();
          handleChangeValues?.(getFieldsValue());
        }}
      >
        <Spin spinning={requestDataSourceLoading.loading} indicator={<LoadingOutlined />}>
          <Tabs
            className={cls(clsPrefix, {
              collapse,
            })}
            tabBarExtraContent={renderCollapse()}
            activeKey={activeKey}
            onChange={setActiveKey}
          >
            {tabs?.map((item) => {
              const key = item.key ?? item.title;

              invariant(key, 'key 必须提供');

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
                  {formConfigs && <OSForm name={key} ref={formRef} {...formConfigs}></OSForm>}
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        </Spin>
      </Form.Provider>
    );
  };

export default React.forwardRef(OSLayoutTabsForm);

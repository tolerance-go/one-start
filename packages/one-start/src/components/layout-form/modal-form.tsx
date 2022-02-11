import type { FormProps } from '@ty/antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import OSDialogModal from '../dialog/modal';
import OSForm from '../form';
import OSTriggerButton from '../trigger/trigger-button';
import type { OSLayoutModalFormAPI, OSLayoutModalFormType } from '../../typings';
import type { OSDialogModalAPI } from '../../typings';
// import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { OSFormAPI } from '../../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';

const OSLayoutModalForm: React.ForwardRefRenderFunction<
  OSLayoutModalFormAPI,
  OSLayoutModalFormType
> = (props, ref) => {
  const { settings, requests, value, onChange, onVisibleChange, formWrapperClassName } = props;

  const osFormRef = useRef<OSFormAPI>(null);
  const osModalDialogRef = useRef<OSDialogModalAPI>(null);
  const {
    buttonTriggerText,
    modalDialogSettings,
    buttonTriggerSettings,
    formSettings,
    params,
    formFieldItems: fieldItems,
  } = settings ?? {};

  const [validateError, setValidateError] = useState(false);
  const clsPrefix = useClsPrefix('layout-modal-form');

  const validateForm = async () => {
    const result = await osFormRef.current!.validate();

    if (result?.error) {
      setValidateError(true);
    }
    return result;
  };

  const triggerFieldValidate: FormProps['onFieldsChange'] = (changedFields, fields) => {
    /**
     * 字段除了本身的值变化外，校验也是其状态之一。因而在触发字段变化会经历以下几个阶段：
     * Trigger value change
     * Rule validating
     * Rule validated
     * 在触发过程中，调用 isFieldValidating 会经历 false > true > false 的变化过程。
     * 非连续触发修改，只会 Trigger value change -> Rule validated
     * onValuesChange 一定在 onFieldsChange 之前执行
     */
    const isValidating = fields.some((item) => item.validating);

    if (!isValidating) {
      const isError = fields.some((item) => item.errors?.length);
      if (isError) {
        setValidateError(true);
      } else {
        setValidateError(false);
      }
    }
  };

  useImperativeHandle(ref, () => {
    return {
      ...osFormRef.current!,
      validate: validateForm,
    };
  });

  return (
    <>
      <OSDialogModal
        ref={osModalDialogRef}
        forceRender
        destroyOnClose={false}
        className={`${clsPrefix}-modal`}
        settings={{
          ...modalDialogSettings,
          body: (
            <div className={formWrapperClassName}>
              <OSForm
                ref={osFormRef}
                settings={{
                  fieldItems,
                  params,
                  ...formSettings,
                }}
                requests={{
                  requestDataSource: requests?.requestFormDataSource,
                  requestFieldItems: requests?.requestFieldItems,
                }}
                value={value}
                onChange={onChange}
                onFieldsChange={triggerFieldValidate}
              />
            </div>
          ),
        }}
        onVisibleChange={onVisibleChange}
      />
      <OSTriggerButton
        settings={{
          text: buttonTriggerText,
          type: 'primary',
          danger: validateError,
          ...buttonTriggerSettings,
        }}
        onClick={() => {
          osModalDialogRef.current?.push();
        }}
      />
    </>
  );
};

export default React.forwardRef(OSLayoutModalForm);

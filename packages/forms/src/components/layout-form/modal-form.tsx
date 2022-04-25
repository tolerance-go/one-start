import type { FormProps } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import type {
  OSDialogModalAPI,
  OSFormAPI,
  OSLayoutModalFormAPI,
  OSLayoutModalFormType,
} from '@ty-one-start/typings';
import { OSDialogModal } from '@ty-one-start/dialogs';
import OSForm from '../form';
import { OSTriggerButton } from '@ty-one-start/triggers';
import { useClsPrefix } from '@ty-one-start/utils';
import EventEmitter from 'eventemitter3';
import { LayoutModalFormEventBusContext } from '@ty-one-start/provider';

const OSLayoutModalForm: React.ForwardRefRenderFunction<
  OSLayoutModalFormAPI,
  OSLayoutModalFormType
> = (props, ref) => {
  const { settings, requests, value, onChange, onVisibleChange, formWrapperClassName } = props;
  const [eventBus] = useState(new EventEmitter());

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
    <LayoutModalFormEventBusContext.Provider value={eventBus}>
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
        onVisibleChange={(visible) => {
          if (visible) {
            setTimeout(() => {
              eventBus?.emit('layout-modal-form-appear', visible);
              /** modal animation duration */
            }, 300);
          }

          onVisibleChange?.(visible);
        }}
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
    </LayoutModalFormEventBusContext.Provider>
  );
};

export default React.forwardRef(OSLayoutModalForm);

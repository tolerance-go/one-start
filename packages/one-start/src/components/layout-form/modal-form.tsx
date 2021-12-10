import React, { useImperativeHandle, useRef, useState } from 'react';
import OSDialogModal from '../dialog/modal';
import OSForm from '../form';
import OSTriggerButton from '../trigger/trigger-button';
import type { OSDialogModalAPI } from '../typings/dialog';
// import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { OSFormAPI } from '../typings/form';
import type { OSLayoutModalFormAPI, OSLayoutModalFormType } from '../typings';
import utl from 'lodash';

const OSLayoutModalForm: React.ForwardRefRenderFunction<
  OSLayoutModalFormAPI,
  OSLayoutModalFormType
> = (props, ref) => {
  const { settings, requests, value, onChange, onVisibleChange } = props;

  const osFormRef = useRef<OSFormAPI>(null);
  const osModalDialogRef = useRef<OSDialogModalAPI>(null);
  const {
    buttonTriggerText,
    modalDialogSettings,
    buttonTriggerSettings,
    formSettings,
    formFieldItems: fieldItems,
  } = settings ?? {};

  const [validateError, setValidateError] = useState(false);

  const validateForm = async () => {
    const result = await osFormRef.current!.validate();

    if (result?.error) {
      setValidateError(true);
    }
    return result;
  };

  useImperativeHandle(ref, () => {
    return {
      ...osFormRef.current!,
      validate: validateForm,
    };
  });

  const testValidateError = utl.debounce(() => {
    setTimeout(() => {
      if (osFormRef.current?.getFieldsError().some((item) => item.errors.length)) {
        setValidateError(true);
      } else {
        setValidateError(false);
      }
    });
  }, 200);

  /** 避免在表单中存在的时候，高频的触发字段验证 */
  const handleChangeValues = onChange ? utl.debounce(onChange, 400) : undefined;

  return (
    <>
      <OSDialogModal
        ref={osModalDialogRef}
        forceRender
        destroyOnClose={false}
        settings={{
          ...modalDialogSettings,
          body: (
            <OSForm
              ref={osFormRef}
              settings={{
                fieldItems,
                ...formSettings,
              }}
              onValuesChange={() => {
                testValidateError();
              }}
              requests={{
                requestDataSource: requests?.requestFormDataSource,
              }}
              value={value}
              onChange={handleChangeValues}
            />
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

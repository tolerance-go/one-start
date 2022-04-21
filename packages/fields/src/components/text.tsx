import type { InputProps } from '@ty/antd';
import { Input } from '@ty/antd';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import type {
  OSTextFieldAPI,
  OSTextFieldType,
  OSTextFieldValueType,
  RecordType,
} from '@ty-one-start/typings';
import Highlighter from 'react-highlight-words';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { logRequestMessage } from '../utils/log-request-message';
import { useActionsRef } from '../hooks/use-actions-ref';
import utl from 'lodash';

const OSTextField: React.ForwardRefRenderFunction<OSTextFieldAPI, OSTextFieldType> = (
  props,
  ref,
) => {
  const {
    text,
    onValueChange,
    settings,
    mode = 'read',
    value: _value,
    onChange: _onChange,
    requests,
  } = props;

  const {
    bordered,
    autoFocus,
    disabled,
    placeholder,
    searchValue,
    requestParams,
    autoTrim = true,
  } = settings ?? {};
  const { requestTextValue } = requests ?? {};

  const inputRef = useRef<Input>(null);

  const triggerChange = (value?: OSTextFieldValueType) => {
    onValueChange?.(value);

    /** TODO: antd form 内部是根据 target 特征判断取值的，源码链接以后加 */
    return _onChange?.({
      target: {
        value,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const triggerRequestTextValue = async (params?: RecordType) => {
    if (requestTextValue == null) return;

    const { error, data } = await requestTextValue({
      params,
    })
      .then(normalizeRequestOutputs)
      .then(logRequestMessage());

    if (error) return;

    if (data?.text != null && data?.text !== _value) {
      triggerChange(data?.text);
    }
  };

  const apisRef = useActionsRef({
    triggerRequestTextValue,
  });

  useEffect(() => {
    apisRef.current.triggerRequestTextValue(requestParams?.requestTextValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(requestParams?.requestTextValue)]);

  useImperativeHandle(ref, () => inputRef.current!);

  if (mode === 'read') {
    const render = () => {
      const val = text ?? _value;
      if (val != null) {
        if (searchValue != null && searchValue !== val) {
          return (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={searchValue == null ? [] : [searchValue]}
              autoEscape
              textToHighlight={val}
            />
          );
        }
        return val;
      }
      return '--';
    };

    const dom = <span ref={ref as React.MutableRefObject<HTMLSpanElement>}>{render()}</span>;
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: InputProps['onChange'] = (event) => {
      if (autoTrim && event.target.value && inputRef.current?.input) {
        /** onChange 提前修改 value，会同步修改 event 对象 */
        inputRef.current.input.value = utl.trim(event.target.value);
      }

      onValueChange?.(event.target.value);
      return _onChange?.(event);
    };

    return (
      <Input
        allowClear
        disabled={disabled}
        bordered={bordered}
        autoFocus={autoFocus}
        ref={inputRef}
        value={_value}
        onChange={onChange}
        placeholder={placeholder ?? '请输入文本'}
      />
    );
  }
  return null;
};

export default React.forwardRef(OSTextField);
export const Settings: React.FC<OSTextFieldType['settings']> = () => <></>;

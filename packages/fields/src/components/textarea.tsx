import { Input, Typography } from 'antd';
import type { TextAreaProps } from 'antd/lib/input';
import type { TextAreaRef } from 'antd/lib/input/TextArea';
import utl from 'lodash';
import React, { useImperativeHandle, useRef } from 'react';
import type { OSTextareaFieldAPI, OSTextareaFieldType } from '@ty-one-start/typings';

const OSTextareaField: React.ForwardRefRenderFunction<OSTextareaFieldAPI, OSTextareaFieldType> = (
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
    wrapFormType,
  } = props;

  const {
    bordered,
    autoFocus,
    disabled,
    placeholder,
    showCount,
    maxLength,
    ellipsis = { rows: 2, expandable: true, symbol: '更多' },
    autoTrim = true,
    copyable = true,
  } = settings ?? {};

  const inputRef = useRef<TextAreaRef>(null);

  useImperativeHandle(ref, () => inputRef.current!);

  if (mode === 'read') {
    const content = text ?? _value;
    const dom =
      wrapFormType !== 'table-form' && (content?.length || 0) > 1 ? (
        <Typography.Paragraph
          style={{
            marginBottom: 0,
          }}
          copyable={copyable}
          ellipsis={ellipsis}
        >
          {content}
        </Typography.Paragraph>
      ) : (
        <span ref={ref as React.MutableRefObject<HTMLSpanElement>}>{content ?? '--'}</span>
      );
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const onChange: TextAreaProps['onChange'] = (event) => {
      if (autoTrim && event.target.value && inputRef.current?.resizableTextArea?.textArea) {
        /** onChange 提前修改 value，会同步修改 event 对象 */
        inputRef.current.resizableTextArea.textArea.value = utl.trim(event.target.value);
      }

      onValueChange?.(event.target.value);
      return _onChange?.(event);
    };

    return (
      <Input.TextArea
        showCount={showCount}
        maxLength={maxLength}
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

export default React.forwardRef(OSTextareaField);
export const Settings: React.FC<OSTextareaFieldType['settings']> = () => <></>;

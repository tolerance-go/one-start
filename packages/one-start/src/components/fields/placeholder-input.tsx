import { Input, Popover, Space, Tag, Typography } from '@ty/antd';
import type { TextAreaProps } from '@ty/antd/lib/input';
import type { TextAreaRef } from '@ty/antd/lib/input/TextArea';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { OSPlaceholderInputFieldAPI, OSPlaceholderInputFieldType } from '../../typings';
import ResizeObserver from 'rc-resize-observer';
import { useRenderTooltip } from '../utils/use-render-tooltip';

const OSPlaceholderInputField: React.ForwardRefRenderFunction<
  OSPlaceholderInputFieldAPI,
  OSPlaceholderInputFieldType
> = (props, ref) => {
  const { text, onChangeHook, settings, mode = 'read', value: _value, onChange: _onChange } = props;
  const [focus, setFocus] = useState(false);
  const judgeOffsetRef = useRef<{
    offset: number | null;
  }>({
    offset: null,
  });

  const { bordered, autoFocus, disabled, placeholder, placeholders } = settings ?? {};

  const [inputWidth, setInputWidth] = useState<number>();

  const innerRef = useRef<TextAreaRef>(null);

  const tooltipDom = useRenderTooltip({
    title: '点击下方标签进行插入',
  });

  useImperativeHandle(ref, () => innerRef.current!);

  const getTextareaEl = () => {
    const textareaEl = innerRef.current?.resizableTextArea?.textArea as
      | HTMLInputElement
      | undefined;

    return textareaEl;
  };

  useEffect(() => {
    if (judgeOffsetRef.current.offset != null) {
      const textareaEl = getTextareaEl();
      textareaEl?.setSelectionRange(judgeOffsetRef.current.offset, judgeOffsetRef.current.offset);

      judgeOffsetRef.current.offset = null;
    }
  }, [_value]);

  if (mode === 'read') {
    const render = () => {
      const val = text ?? _value;
      if (val != null) {
        return val;
      }
      return '--';
    };

    const dom = <span ref={ref as React.MutableRefObject<HTMLSpanElement>}>{render()}</span>;
    return dom;
  }

  if (mode === 'edit' || mode === 'update') {
    const triggerChange = (value: string) => {
      onChangeHook?.(value);
      return _onChange?.(value);
    };

    const onChange: TextAreaProps['onChange'] = (event) => {
      triggerChange(event.target.value);
    };

    /** 向当前输入内容中插入占位 */
    const insertPlaceholderInInput = (placeholderItem: string, raw: boolean = false) => {
      if (focus === false) {
        return;
      }

      const textareaEl = getTextareaEl();

      const pos =
        textareaEl?.selectionDirection === 'backward'
          ? textareaEl?.selectionStart
          : textareaEl?.selectionEnd;

      if (typeof pos === 'number') {
        const marked = raw ? placeholderItem : `{${placeholderItem}}`;

        const next =
          _value == null ? marked : `${_value.slice(0, pos)}${marked}${_value.slice(pos)}`;

        triggerChange(next);

        judgeOffsetRef.current.offset = pos + marked.length;
      }
    };

    return (
      <ResizeObserver
        onResize={({ width }) => {
          setInputWidth(width);
        }}
      >
        <Popover
          placement="topLeft"
          title={
            <Space size={5}>
              <Typography.Text>模板变量</Typography.Text>
              {tooltipDom}
            </Space>
          }
          visible={focus}
          overlayStyle={{
            maxWidth: inputWidth,
          }}
          content={
            <div
              style={{
                marginBottom: 5,
              }}
            >
              {placeholders?.map((item) => {
                return (
                  <Tag
                    key={item.value}
                    style={{
                      cursor: 'pointer',
                    }}
                    onMouseDown={(event) => {
                      /** 阻止 input 失去焦点 */
                      event.preventDefault();
                      event.stopPropagation();

                      insertPlaceholderInInput(item.value, item.raw);

                      return false;
                    }}
                  >
                    {item.label}
                  </Tag>
                );
              })}
            </div>
          }
        >
          <Input.TextArea
            allowClear
            disabled={disabled}
            bordered={bordered}
            autoFocus={autoFocus}
            ref={innerRef}
            value={_value}
            onChange={onChange}
            onKeyDown={(event) => {
              if (event.key.toLowerCase() === 'backspace') {
                const textareaEl = getTextareaEl();

                /** 有框选不处理 */
                if (textareaEl?.selectionStart !== textareaEl?.selectionEnd) {
                  return;
                }

                const pos = textareaEl?.selectionStart;

                if (typeof pos === 'number' && _value) {
                  /** 前一个字符命中 */
                  if (_value[pos - 1] === '}') {
                    /** 手动控制 next value，整体删除 */
                    event.preventDefault();
                    event.stopPropagation();

                    const tagItem = _value.slice(0, pos);

                    const startTagIndex =
                      tagItem.length -
                      tagItem
                        .split('')
                        .reverse()
                        .findIndex((item) => item === '{');

                    const endTagIndex = pos - 1;

                    const next = `${_value.slice(0, startTagIndex - 1)}${_value.slice(
                      endTagIndex + 1,
                    )}`;

                    triggerChange(next);

                    judgeOffsetRef.current.offset = startTagIndex - 1;
                  }
                }
              }
            }}
            placeholder={placeholder ?? '请输入文本'}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
          />
        </Popover>
      </ResizeObserver>
    );
  }

  return null;
};

export default React.forwardRef(OSPlaceholderInputField);
export const Settings: React.FC<OSPlaceholderInputFieldType['settings']> = () => <></>;

import type { InputNumberProps } from '@ty/antd';
import { Col, Input, InputNumber, Row } from '@ty/antd';
import cls from 'classnames';
import numeral from 'numeral';
import React from 'react';
import type { OSDigitFieldBaseAPI, OSDigitFieldBaseType } from '../../typings';
import { useClsPrefix } from '../utils/use-cls-prefix';

const OSDigitFieldBase: React.ForwardRefRenderFunction<OSDigitFieldBaseAPI, OSDigitFieldBaseType> =
  (props, ref) => {
    const prefixCls = useClsPrefix('digit-base');
    const {
      settings,
      parseValue: _pareseValue,
      transformValue,
      mode = 'read',
      value: _value,
      onChange: _onChange,
      onChangeHook,
      text: _text,
      onFocus,
      onBlur,
      formatter,
    } = props;

    const {
      autoFocus,
      bordered,
      addonPlacement = 'before',
      format = '0,0.[0000000]',
      addon,
      min,
      max,
      step,
      stringMode,
      placeholder,
      precision,
      disabled,
      addonFlexWidth,
    } = settings ?? {};

    const parese = (val?: number | string | typeof NaN) => {
      const next = _pareseValue?.(val) ?? val;
      if (next == null || next === '' || Number.isNaN(next)) {
        return undefined;
      }
      return next;
    };

    if (mode === 'read') {
      const text = parese(_text ?? _value);

      const digit =
        text != null
          ? (() => {
              if (formatter) {
                return formatter(text);
              }
              /*  numeral 版本需固定 2.0.4, 否则格式化大数和小数会出现 NaN
               *   github: https://github.com/adamwdraper/Numeral-js/issues/682#issuecomment-678529290
               */
              return numeral(text).format(format);
            })()
          : '--';

      if (text != null && addon) {
        if (addonPlacement === 'before') {
          return (
            <span ref={ref}>
              <span style={{ marginRight: 5 }}>{addon}</span>
              {digit}
            </span>
          );
        }
        if (addonPlacement === 'after') {
          return (
            <span ref={ref}>
              {digit}
              {addon}
            </span>
          );
        }
      }

      const dom = <span ref={ref}>{digit}</span>;
      return dom;
    }
    if (mode === 'edit' || mode === 'update') {
      const onChange: InputNumberProps['onChange'] = (value) => {
        const next = transformValue?.(value) ?? value;
        onChangeHook?.(next);
        return _onChange?.(next);
      };

      const value = parese(_value);

      const renderDom = () => {
        if (addon) {
          const addonDom = (
            <Col flex={addonFlexWidth ?? '20px'}>
              <Input
                {...{
                  [addonPlacement === 'before' ? 'addonBefore' : 'addonAfter']: addon,
                }}
                className={cls(`${prefixCls}-input-number-unit-item`, {
                  'no-border': bordered === false,
                  'before-unit': addonPlacement === 'before',
                  'after-unit': addonPlacement === 'after',
                  disabled,
                })}
              />
            </Col>
          );
          const inputNumberDom = (
            <Col flex="auto">
              <InputNumber
                ref={ref as React.RefObject<HTMLInputElement>}
                style={{
                  width: '100%',
                }}
                bordered={bordered}
                autoFocus={autoFocus}
                onChange={onChange}
                formatter={props.formatter}
                parser={props.parser}
                onFocus={onFocus}
                onBlur={onBlur}
                className={cls(`${prefixCls}-input-number-input-item`, {
                  'no-border': bordered === false,
                  'has-unit-after': addonPlacement === 'after',
                  'has-unit-before': addonPlacement === 'before',
                })}
                value={value}
                min={min}
                max={max}
                step={step}
                stringMode={stringMode}
                placeholder="请输入数值"
                precision={precision}
                disabled={disabled}
              />
            </Col>
          );

          return (
            <Input.Group
              className={cls(`${prefixCls}-input-group`, {
                'no-border': bordered === false,
                'has-unit-after': addonPlacement === 'after',
                'has-unit-before': addonPlacement === 'before',
              })}
            >
              {addonPlacement === 'before' ? (
                <Row
                  style={{
                    flexFlow: 'row nowrap',
                  }}
                >
                  {addonDom}
                  {inputNumberDom}
                </Row>
              ) : (
                <Row
                  style={{
                    flexFlow: 'row nowrap',
                  }}
                >
                  {inputNumberDom}
                  {addonDom}
                </Row>
              )}
            </Input.Group>
          );
        }

        return (
          <InputNumber
            ref={ref as React.RefObject<HTMLInputElement>}
            style={{
              width: '100%',
            }}
            bordered={bordered}
            autoFocus={autoFocus}
            onChange={onChange}
            formatter={props.formatter}
            onFocus={onFocus}
            onBlur={onBlur}
            parser={props.parser}
            value={value}
            min={min}
            max={max}
            step={step}
            stringMode={stringMode}
            placeholder={placeholder ?? '请输入数值'}
            precision={precision}
            disabled={disabled}
          />
        );
      };
      const dom = renderDom();
      return dom;
    }
    return null;
  };

export default React.forwardRef(OSDigitFieldBase);

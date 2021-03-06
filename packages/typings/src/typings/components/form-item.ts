import type { FormItemProps, Rule } from 'antd/lib/form';
import type { AbstractTooltipProps } from 'antd/lib/tooltip';
import type React from 'react';
import type { CSSProperties } from 'react';
import type { OSCore, RequestIO } from './core';
import type { ValueAsyncLinkage, ValueLinkage } from './linkage';
import type { OSRule } from './rules';

export type OSFormItemTooltip = {
  title: (string | React.ReactNode)[];
  overlayStyle?: React.CSSProperties;
  color?: AbstractTooltipProps['color'];
};

export type OSFormItemInputHistoryData = {
  // author?: string;
  // dateTime?: string;
  // history: any;
  current: any;
};

export type OSFormItemSimpleTooltip = string | string[] | OSFormItemTooltip;

export interface OSFormItemType<Value = any> extends OSCore {
  settings?: {
    /** label 对齐方式 */
    labelAlign?: 'left' | 'right';
    tooltip?: OSFormItemSimpleTooltip;
    rules?: (OSRule | Rule)[];
    title?: string;
    dataIndex?: FormItemProps['name'];
    preserve?: FormItemProps['preserve'];
    initialValue?: Value;
    labelCol?: FormItemProps['labelCol'];
    wrapperCol?: FormItemProps['wrapperCol'];
    validateFirst?: FormItemProps['validateFirst'];
    formItemId?: string;
    /** 是否隐藏（销毁dom） */
    hide?: boolean;
    /** 是否隐藏 */
    visible?: boolean;
    /** 警告的提示 */
    warningRules?: (OSRule | Rule)[];
    styles?: CSSProperties;
    /** 内联错误格式 */
    inlineError?: boolean;
    /** 表单必填样式显示或隐藏 */
    required?: boolean;
    key?: string;
    /** 联动信息 */
    linkagetip?: string | string[];
    /** 注册同步计算联动 */
    valueLinkage?: {
      /**
       * 指定在某个字段注册的联动后面出现
       * 谁注册了联动会修改当前字段的依赖，那么就应该设置在他们后面
       */
      afterIndexIdRegisted?: string | string[];
      linkage: ValueLinkage;
    };
    /** 注册异步计算联动 */
    valueAsyncLinkage?: {
      /** 指定在某个字段注册的联动后面出现 */
      // 串行
      serial?: {
        afterIndexIdRegisted?: string | string[];
        linkage: ValueAsyncLinkage;
      };
      // 并行
      parallel?: ValueAsyncLinkage;
    };
  };
  requests?: {
    requestFormItemValue?: RequestIO<void, Value>;
    requestInitialValue?: RequestIO<{ value?: any }, Value>;
  };
  isInTableCell?: boolean;
  noStyle?: boolean;
  renderFormItem?: (dom: React.ReactNode, props: Omit<OSFormItemType, 'renderFormItem'>) => void;
  className?: string;
  validateTrigger?: string[];
  /** 字段的历史修改数据 */
  historyData?: OSFormItemInputHistoryData[];
  /** 是否只读展示 */
  readonly?: boolean;
  /** 是否隐藏 formItem control 部分下面的线 */
  hideItemControlLine?: boolean;
  valueType?: string;
  fieldSettings?: OSCore['settings'];
}

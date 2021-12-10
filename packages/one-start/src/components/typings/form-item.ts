import type { FormItemProps, Rule } from '@ty/antd/lib/form';
import type { AbstractTooltipProps } from '@ty/antd/lib/tooltip';
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

export type OSFormItemSimpleTooltip = string | string[] | OSFormItemTooltip;

export interface OSFormItemType<Value = any> extends OSCore {
  settings?: {
    tooltip?: OSFormItemSimpleTooltip;
    rules?: (OSRule | Rule)[];
    title?: string;
    dataIndex?: FormItemProps['name'];
    preserve?: FormItemProps['preserve'];
    initialValue?: Value;
    labelCol?: FormItemProps['labelCol'];
    wrapperCol?: FormItemProps['wrapperCol'];
    validateFirst?: FormItemProps['validateFirst'];
    /** 是否隐藏 */
    hide?: boolean;
    /** 警告的提示 */
    warningRules?: (OSRule | Rule)[];
    styles?: CSSProperties;
    /** 内联错误格式 */
    inlineError?: boolean;
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
  noStyle?: boolean;
  renderFormItem?: (dom: React.ReactNode, props: Omit<OSFormItemType, 'renderFormItem'>) => void;
  className?: string;
}

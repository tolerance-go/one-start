import type {
  DatePickerProps,
  Input,
  InputNumberProps,
  RadioChangeEvent,
  SelectProps,
  Transfer,
  TreeSelectProps,
  UploadProps,
} from '@ty/antd';
import type { SizeType } from '@ty/antd/es/config-provider/SizeContext';
import type { UploadFile } from '@ty/antd/es/upload/interface';
import type { PickerProps, RangePickerDateProps } from '@ty/antd/lib/date-picker/generatePicker';
import type { TextAreaRef } from '@ty/antd/lib/input/TextArea';
import type { RefSelectProps } from '@ty/antd/lib/select';
import type { ParagraphProps } from '@ty/antd/lib/typography/Paragraph';
import type { Moment } from 'moment';
import type { NamePath } from 'rc-field-form/lib/interface';
import type { SharedTimeProps } from 'rc-picker/lib/panels/TimePanel';
import type Picker from 'rc-picker/lib/Picker';
import type React from 'react';
import type { Component } from 'react';
import type { RecordType } from '../core';
import type { OSCore, RequestIO } from './core';
import type { OSResMessage } from './message';
import type { OSTriggerButtonType } from './trigger';

export interface OSField<Value = any, ChangeValue = Value> extends OSCore {
  type?: string;
  key?: string;
  mode?: 'edit' | 'read' | 'update';
  /** text 在 read 模式下的优先级比 value 更高，比如表格外面了套了一层大 form，用 text 就可以展示静态数据 */
  text?: Value;
  value?: Value;
  onChange?: (value?: ChangeValue) => void;
  /** 如果 field 存在于 form 内的 name 字段 */
  name?: string;
}

export type OSFieldBaseConfigs<ValueType = any> = {
  onChangeHook?: (value?: ValueType) => void;
  size?: SizeType;
  /** 是否外部被 FormItem 包裹 */
  isWrapFormItem?: boolean;
  /** 所在 form 类型 */
  wrapFormType?: 'table-form' | 'form';
};

export type OSFieldBaseSettings = {
  /** 自动聚焦 */
  autoFocus?: boolean;
  /** 无边框模式 */
  bordered?: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 输入提示信息 */
  placeholder?: string;
  /** 尺寸大小 */
  size?: SizeType;
  id?: string;
  className?: string;
};

export type OSDigitFieldValueType = string | number;

export type OSDigitFieldBaseAPI = HTMLSpanElement | HTMLInputElement;
export interface OSDigitFieldBaseType
  extends OSField<OSDigitFieldValueType>,
    OSFieldBaseConfigs<OSDigitFieldValueType> {
  type?: 'digit-base';
  settings?: {
    precision?: InputNumberProps['precision'];
    addon?: string;
    addonFlexWidth?: string;
    /** 格式化，参考 [numeraljs](http://numeraljs.com/) */
    format?: string;
    /** 单位在前面还是后面 */
    addonPlacement?: 'before' | 'after';
    /** 是否大数，value 会转成 string */
    stringMode?: boolean;
    min?: number | string;
    max?: number | string;
    step?: number | string;
  } & OSFieldBaseSettings;
  formatter?: InputNumberProps['formatter'];
  parser?: InputNumberProps['parser'];
  onFocus?: InputNumberProps['onFocus'];
  onBlur?: InputNumberProps['onBlur'];
  transformValue?: (value?: OSDigitFieldValueType) => OSDigitFieldValueType | undefined;
  parseValue?: (value?: OSDigitFieldValueType) => OSDigitFieldValueType | typeof NaN | undefined;
}

export type OSActionsFieldValueType = never;

export interface OSActionsFieldType extends OSField<OSActionsFieldValueType> {
  type?: 'actions';
  settings?: {
    /** 定义操作项 */
    actions?: (React.ReactElement | null)[];
    /**
     * 项的间距
     * @default 0
     */
    gap?: number;
    /**
     * 项的分隔符
     * @default <span style={{ color: '#ddd' }}>|</span>
     */
    splitMarker?: React.ReactNode;
  } & OSFieldBaseSettings;
}

export type OSCustomFieldValueType = never;

export type OSCustomFieldElementProps = OSField<OSCustomFieldValueType> &
  OSFieldBaseConfigs<OSCustomFieldValueType> & {
    settings?: OSFieldBaseSettings;
  };

export interface OSCustomFieldType
  extends OSField<OSCustomFieldValueType>,
    OSFieldBaseConfigs<OSCustomFieldValueType> {
  type?: 'custom';
  settings?: {
    element?: React.ReactElement<OSCustomFieldElementProps>;
  } & OSFieldBaseSettings;
}

export type OSDigitFieldAPI = HTMLInputElement | HTMLSpanElement;

export interface OSDigitFieldType extends OSField, OSFieldBaseConfigs<OSDigitFieldValueType> {
  type?: 'digit';
  settings?: {
    /** 格式化，参考 http://numeraljs.com/ */
    format?: string;
    /** 是否大数，value 会转成 string */
    stringMode?: boolean;
    /** 最小值 */
    min?: number | string;
    /** 最大值 */
    max?: number | string;
    precision?: number;
    step?: number;
  } & OSFieldBaseSettings &
    Pick<Required<OSDigitFieldBaseType>['settings'], 'addon' | 'addonPlacement' | 'addonFlexWidth'>;
}

export type OSRelativeDayFieldAPI = HTMLInputElement | HTMLSpanElement;
export type OSRelativeDayFieldValueType = string | number;

export interface OSRelativeDayFieldType
  extends OSField,
    OSFieldBaseConfigs<OSRelativeDayFieldValueType> {
  type?: 'relative-day';
  settings?: {
    /** 最小值 */
    min?: number | string;
    /** 最大值 */
    max?: number | string;
  } & OSFieldBaseSettings;
}

export type OSImageFieldAPI = Input | HTMLImageElement;

export type OSImageFieldValueType = string | Blob;

export interface OSImageFieldType extends OSField, OSFieldBaseConfigs<OSImageFieldValueType> {
  type?: 'image';
  settings?: {
    width?: string | number;
    height?: string | number;
    /** 加载失败容错地址 */
    fallback?: string;
  } & OSFieldBaseSettings;
}

export type OSMoneyFieldAPI = HTMLInputElement | HTMLSpanElement;

export type OSMoneyFieldValueType = OSDigitFieldValueType | OSMoneyFieldUnitValueType;

export type OSMoneyFieldUnitValueType = {
  unit: string;
  value: number | string | undefined;
};

export interface OSMoneyFieldType
  extends OSField<OSMoneyFieldValueType>,
    OSFieldBaseConfigs<OSMoneyFieldValueType> {
  type?: 'money';
  settings?: {
    /** 格式化，参考 http://numeraljs.com/ */
    format?: string;
    /** 单位显示 */
    unit?: string;
    /** 是否大数，value 会转成 string */
    stringMode?: boolean;
    min?: number | string;
    max?: number | string;
    /**
     * value 类型变为
     * {
     *  unit: string;
     *  value: number | string;
     * }
     */
    unitInValue?: boolean;
  } & OSFieldBaseSettings;
}

export type OSPercentFieldAPI = HTMLInputElement | HTMLSpanElement;

export interface OSPercentFieldType extends OSField, OSFieldBaseConfigs<OSDigitFieldValueType> {
  type?: 'percent';
  settings?: {
    /** 格式化，参考 http://numeraljs.com/ */
    format?: string;
    /** 内部 value 数据是否为小数形式 */
    decimalData?: boolean;
    /** 是否大数，value 会转成 string */
    stringMode?: boolean;
    min?: number | string;
    max?: number | string;
  } & OSFieldBaseSettings;
}

export type OSOpenableFieldBaseAPI = {
  open: () => void;
};

export type OSSelectBaseAPI = OSOpenableFieldBaseAPI;

export type OSSelectFieldAPI = HTMLSpanElement | (RefSelectProps & OSSelectBaseAPI);

export type RawValue = string | number;
export interface LabeledValue {
  key?: string;
  value: RawValue;
  label: React.ReactNode;
}

/** 扩展了 data 参数，方便用来做字段间的联动 */
export type OSSelectFieldLabelValueType = LabeledValue & {
  data?: RecordType;
};

export type OSSelectFieldValueItemType = RawValue | OSSelectFieldLabelValueType;
export type OSSelectFieldValueArrayType = RawValue[] | OSSelectFieldLabelValueType[];

export type OSSelectFieldValueType = OSSelectFieldValueArrayType | OSSelectFieldValueItemType;

export type OSSelectOptionItem = { key?: string; label?: string; value: string; data?: RecordType };

export type OSSimpleFormFields = {
  dataIndex: NamePath;
  valueType:
    | 'string'
    | 'digit'
    | 'actions'
    | 'custom'
    | 'digit'
    | 'relative'
    | 'image'
    | 'money'
    | 'percent'
    | 'select'
    | 'chain'
    | 'textarea'
    | 'option'
    | 'text'
    | 'radio'
    | 'date'
    | 'date'
    | 'switch';
  title?: string;
}[];

export type OSSelectFieldShowInfo = {
  popoverWidth?: string | number;
  fieldItems: OSSimpleFormFields;
};

export interface OSSelectFieldType<
  ValueType = OSSelectFieldValueType,
  ExtraRequestOptions = RecordType,
> extends OSField<ValueType>,
    OSFieldBaseConfigs<ValueType> {
  type?: 'select';
  settings?: {
    maxTagCount?: number;
    valueEnums?: RecordType;
    params?: RecordType;
    requestParams?: RecordType;
    allowClear?: boolean;
    mode?: SelectProps<ValueType>['mode'];
    /** local 表示前端搜索 */
    showSearch?: SelectProps<ValueType>['showSearch'] | 'local';
    labelInValue?: SelectProps<ValueType>['labelInValue'];
    dropdownClassName?: SelectProps<ValueType>['dropdownClassName'];
    /** 是否关闭下拉请求 */
    disabledRequestOptionsWhenOpen?: boolean;
    /** 是否关闭 mounted 后自动下拉请求 */
    disabledRequestOptionsWhenMounted?: boolean;
    dropdownMatchSelectWidth?: boolean;
    /**
     * 展示更多字段信息
     * @default
     * showInfo: {
     *   'close': {
     *      title: '当天收盘价',
     *      valueType: 'digit'
     *    },
     * }
     */
    showInfo?: OSSimpleFormFields | OSSelectFieldShowInfo;
    maxWidth?: number;
  } & OSFieldBaseSettings;
  requests?: {
    /** 请求下拉选项 */
    requestOptions?: RequestIO<
      { searchValue?: string; params?: RecordType } & ExtraRequestOptions,
      OSSelectOptionItem[]
    >;
  };
  tagRender?: SelectProps<ValueType>['tagRender'];
  /** 自动请求 */
  autoFetchSelectOptionsWhenMounted?: boolean;
  className?: string;
  /** 自定义编辑状态下的渲染逻辑 */
  renderOnRead?: (
    text?: OSSelectFieldValueType,
    optionMaps?: Record<string, React.ReactNode>,
  ) => React.ReactElement;
  /** 请求注入的额外参数 */
  requestExtra?: () => ExtraRequestOptions;
}

export type OSTreeSelectFieldAPI = HTMLSpanElement | (RefSelectProps & OSSelectBaseAPI);

export type OSTreeSelectOptionItem = {
  key?: string;
  label?: string;
  value: string;
  children?: OSTreeSelectOptionItem[];
  data?: RecordType;
  disabled?: boolean;
};

export type OSTreeSelectFieldValueItemType = RawValue | OSSelectFieldLabelValueType;
export type OSTreeSelectFieldValueArrayType = RawValue[] | OSSelectFieldLabelValueType[];

export type OSTreeSelectFieldValueType = OSSelectFieldValueArrayType | OSSelectFieldValueItemType;

export interface OSTreeSelectFieldType<
  ValueType = OSTreeSelectFieldValueType,
  ExtraRequestOptions = RecordType,
> extends OSField<ValueType>,
    OSFieldBaseConfigs<ValueType> {
  type?: 'tree-select';
  settings?: {
    /** 是否在展示状态下使用树形展示 */
    readonlyWithTree?: boolean;
    treeOptions?: OSTreeSelectOptionItem[];
    params?: RecordType;
    allowClear?: boolean;
    multiple?: TreeSelectProps<ValueType>['multiple'];
    /** local 表示前端搜索 */
    showSearch?: TreeSelectProps<ValueType>['showSearch'] | 'local';
    labelInValue?: TreeSelectProps<ValueType>['labelInValue'];
    showCheckedStrategy?: TreeSelectProps<ValueType>['showCheckedStrategy'];
    disabledRequestOptionsWhenOpen?: boolean;
    /** 是否关闭 mounted 后自动下拉请求 */
    disabledRequestOptionsWhenMounted?: boolean;
    dropdownStyle?: React.CSSProperties;
    dropdownContentStyle?: React.CSSProperties;
  } & OSFieldBaseSettings;
  requests?: {
    /** 请求下拉选项 */
    requestOptions?: RequestIO<
      { searchValue?: string; params?: RecordType } & ExtraRequestOptions,
      OSTreeSelectOptionItem[]
    >;
  };
  autoFetchSelectOptions?: boolean;
  className?: string;
  /** 请求注入的额外参数 */
  requestExtra?: () => ExtraRequestOptions;
}

export type OSChainSelectBaseAPI = OSSelectBaseAPI;

export type OSChainSelectFieldAPI = HTMLSpanElement | (RefSelectProps & OSChainSelectBaseAPI);

export type OSChainSelectFieldValueType = RawValue[];

export type OSChainSelectOptionItem = OSSelectOptionItem;

export type OSChainSelectFieldType = Omit<
  OSSelectFieldType<OSChainSelectFieldValueType>,
  'type'
> & {
  type?: 'chain-select';
};

export type OSTextareaFieldValueType = string;

export type OSTextareaFieldAPI = TextAreaRef | HTMLSpanElement;

export interface OSTextareaFieldType
  extends OSField<OSTextareaFieldValueType, React.ChangeEvent<HTMLTextAreaElement>>,
    OSFieldBaseConfigs<OSTextareaFieldValueType> {
  type?: 'textarea';
  settings?: {
    showCount?: boolean;
    maxLength?: number;
    /** 自动 trim */
    autoTrim?: boolean;
    /** 只读可复制 */
    copyable?: boolean;
    ellipsis?: ParagraphProps['ellipsis'];
  } & OSFieldBaseSettings;
}

export type OSOptionFieldAPI = HTMLInputElement;

export interface OSOptionFieldType extends OSField {
  type?: 'option';
  settings?: {} & OSFieldBaseSettings;
}

export type OSTextFieldValueType = string;

export type OSTextFieldAPI = HTMLSpanElement | Input;
export interface OSTextFieldType
  extends OSField<OSTextFieldValueType, React.ChangeEvent<HTMLInputElement>>,
    OSFieldBaseConfigs<OSTextFieldValueType> {
  type?: 'text';
  settings?: {
    searchValue?: string;
    requestParams?: RecordType;
    /** 自动 trim */
    autoTrim?: boolean;
  } & OSFieldBaseSettings;
  requests?: {
    /** 异步获取 value */
    requestTextValue?: RequestIO<
      { params?: RecordType },
      {
        text?: OSTextFieldValueType;
        message?: OSResMessage;
      }
    >;
  };
}

export type OSPlaceholderInputFieldValueType = string;

export type OSPlaceholderInputFieldAPI = TextAreaRef | Input;
export interface OSPlaceholderInputFieldType
  extends OSField<OSPlaceholderInputFieldValueType>,
    OSFieldBaseConfigs<OSPlaceholderInputFieldValueType> {
  type?: 'placeholder-input';
  settings?: {
    /** 定义占位标示 */
    placeholders?: {
      label: string;
      value: string;
      /** 是否使用原始值插入 */
      raw?: boolean;
    }[];
    /** 触发表单 onChange 前，允许修改其 value */
    valueTransform?: (value: OSPlaceholderInputFieldValueType) => OSPlaceholderInputFieldValueType;
  } & OSFieldBaseSettings;
}

export type OSUploadFieldValueType = UploadFile[];

export type OSUploadFieldAPI = HTMLSpanElement;

export interface OSUploadFieldType
  extends OSField<OSUploadFieldValueType>,
    OSFieldBaseConfigs<OSUploadFieldValueType> {
  type?: 'upload';
  settings?: {
    /**
     * 是否立即上传
     * @default false
     */
    immediately?: boolean;
    /** 最大文件大小 单位: M */
    maxSize?: number;
    /** 重复校验 */
    duplicationCheck?: boolean;
    /** 上传按钮文案 */
    triggerButtonText?: string;
    /** 触发按钮配置 */
    triggetButtonSettings?: OSTriggerButtonType['settings'];
  } & Pick<
    UploadProps,
    'accept' | 'action' | 'headers' | 'name' | 'data' | 'multiple' | 'maxCount'
  > &
    OSFieldBaseSettings;
  requests?: {
    /** 可根据文件上传接口返回结果反馈一些报错信息或进行操作 */
    requestAfterUpload?: RequestIO<
      { fileList: UploadFile<any>[]; file: UploadFile<any> },
      UploadFile<any>[]
    >;
  };
}

export type OSRadioOptionItem = { label: string; value: string; disabled?: boolean };

export type OSRadioFieldValueType = string;

export type OSRadioFieldAPI = HTMLSpanElement | HTMLDivElement;
export interface OSRadioFieldType
  extends OSField<OSRadioFieldValueType, RadioChangeEvent>,
    OSFieldBaseConfigs<OSRadioFieldValueType> {
  type?: 'radio';
  settings?: {
    valueEnums?: RecordType;
    options?: OSRadioOptionItem[];
  } & OSFieldBaseSettings;
}

export type OSTransferFieldValueType = string[];

export type OSTransferFieldAPI =
  | HTMLSpanElement
  | Transfer<{
      key?: string | undefined;
      title: string;
      children?: OSTransferFieldValueType | undefined;
    }>;
export interface OSTransferFieldType
  extends OSField<OSTransferFieldValueType>,
    OSFieldBaseConfigs<OSTransferFieldValueType> {
  type?: 'transfer';
  settings?: {
    source?: {
      key?: string;
      title: string;
      children?: OSTransferFieldValueType;
    }[];
  } & OSFieldBaseSettings;
}

export type OSDateFieldAPI =
  | (Component<PickerProps<Moment>, any, any> & OSOpenableFieldBaseAPI & Picker<Moment>)
  | HTMLSpanElement;

export type OSDateFieldValueType = DatePickerProps['value'] | string;

export interface OSDateFieldType extends OSField, OSFieldBaseConfigs<OSDateFieldValueType> {
  type?: 'date';
  settings?: {
    /** 日期格式化 */
    format?: string;
    disabledDate?: DatePickerProps['disabledDate'];
    showNow?: boolean;
    showTime?: SharedTimeProps<Moment> | boolean;
  } & OSFieldBaseSettings;
}

export type OSDateRangeFieldInputAPI = Component<PickerProps<Moment>, any, any> &
  OSOpenableFieldBaseAPI &
  Picker<Moment>;

export type OSDateRangeFieldAPI = HTMLSpanElement | OSDateRangeFieldInputAPI;

export type OSDateRangeFieldValueType = RangePickerDateProps<Moment | string>['value'] | string;

export interface OSDateRangeFieldType
  extends OSField<OSDateRangeFieldValueType, RangePickerDateProps<Moment>['value']>,
    OSFieldBaseConfigs<RangePickerDateProps<Moment>['value']> {
  type?: 'date-range';
  settings?: {
    showTime?:
      | boolean
      | (Omit<SharedTimeProps<Moment>, 'defaultValue'> & {
          /** 这里的类型要和 date 的兼容，否则整体类型推倒会失败 */
          defaultValue?: Moment[] | Moment;
        });
    /** 日期格式化 */
    format?: string;
    disabledDate?: RangePickerDateProps<Moment>['disabledDate'];
  } & OSFieldBaseSettings;
}

export type OSSwitchFieldAPI = HTMLInputElement | HTMLSpanElement;

export type OSSwitchFieldValueType = boolean;

export interface OSSwitchFieldType
  extends OSField<OSSwitchFieldValueType>,
    OSFieldBaseConfigs<OSSwitchFieldValueType> {
  type?: 'switch';
  settings?: {} & OSFieldBaseSettings;
}
export type OSTimeLagFieldAPI = Record<string, HTMLInputElement | HTMLSpanElement>;

export interface OSTimeLagFieldType extends OSField, OSFieldBaseConfigs<OSDigitFieldValueType> {
  type?: 'time-lag';
  settings?: {
    stringMode?: boolean;
    /** 前置描述 */
    addonBefore?: string;
    /** 末尾描述 */
    addonAfter?: string;
  } & OSFieldBaseSettings;
}

export type OSFieldValueType =
  | OSDigitFieldValueType
  | OSSelectFieldValueType
  | OSTextareaFieldValueType
  | OSTextFieldValueType
  | OSDateFieldValueType
  | OSDateRangeFieldValueType
  | OSActionsFieldValueType
  | OSSwitchFieldType
  | OSCustomFieldType
  | OSImageFieldType
  | OSChainSelectFieldType
  | OSRadioFieldType
  | OSPlaceholderInputFieldType
  | OSUploadFieldType;

export type OSFieldAPI =
  | OSTextFieldAPI
  | OSSelectFieldAPI
  | OSPercentFieldAPI
  | OSMoneyFieldAPI
  | OSDigitFieldAPI
  | OSSwitchFieldAPI
  | OSImageFieldAPI
  | OSChainSelectFieldAPI
  | OSRadioFieldAPI
  | OSTimeLagFieldAPI
  | OSPlaceholderInputFieldAPI
  | OSUploadFieldAPI;

import type { OSSwitchFieldType, OSTimeLagFieldType } from './field';
import type { FormInstance, FormItemProps, FormProps } from '@ty/antd/lib/form';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import type { OSCore, RequestIO } from './core';
import type { RecordType } from '../core';
import type {
  OSActionsFieldType,
  OSDateFieldType,
  OSDateRangeFieldType,
  OSDigitFieldType,
  OSField,
  OSMoneyFieldType,
  OSOptionFieldType,
  OSPercentFieldType,
  OSSelectFieldType,
  OSTextareaFieldType,
  OSTextFieldType,
  OSCustomFieldType,
  OSImageFieldType,
  OSRelativeDayFieldType,
  OSChainSelectFieldType,
  OSRadioFieldType,
  OSTransferFieldType,
  OSTreeSelectFieldType,
} from './field';
import type { OSFormItemType } from './form-item';
import type { NamePath } from '@ty/antd/lib/form/interface';
import type { Meta } from 'rc-field-form/es/interface';
import type { ValueAsyncLinkage, ValueLinkage } from './linkage';
import { OSFormItemInputHistoryData } from '.';

export interface OSFormGroupFieldType extends OSField {
  type?: 'group';
  settings?: {
    title?: string;
    dataIndex?: NamePath;
    gutter?: number;
    actions?: React.ReactElement[];
  };
}

export type OSFormItemDependenciesConfigs = {
  dependencies?: string[];
};

export type OSTableFormFieldItemRender = (options: {
  mode: 'edit' | 'read';
  rowData: RecordType;
  rowIndex: number;
  rowId: string;
  dom: React.ReactNode;
}) => React.ReactNode;

export type CreatePureFormFieldItemConfigs<
  FieldType extends OSField,
  SettingsFnOption extends RecordType = RecordType,
  Extra extends OSCore = OSCore,
> = {
  type?: FieldType['type'];
  settings?:
    | (FieldType['settings'] & OSFormItemType['settings'] & Extra['settings'])
    | ((
        options: SettingsFnOption,
      ) => FieldType['settings'] & OSFormItemType['settings'] & Extra['settings']);
  requests?: FieldType['requests'] & OSFormItemType['requests'] & Extra['requests'];
  render?: OSTableFormFieldItemRender;
};

/** settings 不是函数 */
export type CreateStaticPureFormFieldItemConfigs<
  FieldType extends OSField,
  Extra extends OSCore = OSCore,
> = {
  type?: FieldType['type'];
  settings?: FieldType['settings'] & OSFormItemType['settings'] & Extra['settings'];
  requests?: FieldType['requests'] & OSFormItemType['requests'] & Extra['requests'];
};

export type CreateStaticPureFormFieldItemConfigsType<T extends OSCore = OSCore> =
  CreateStaticPureFormFieldItemConfigs<T, OSFormFieldItemExtra> & OSFormItemDependenciesConfigs;

export type _OSFormFieldItemWithStaticPureConfigs<
  CustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> =
  | CustomValueType
  | (CreateStaticPureFormFieldItemConfigs<OSDigitFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTreeSelectFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSRadioFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSRelativeDayFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSImageFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSMoneyFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSPercentFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSOptionFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTextFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSDateFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTextareaFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSDateRangeFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSSwitchFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSActionsFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSSelectFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSFormGroupFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSChainSelectFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSCustomFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTimeLagFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSTransferFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs);

export type OSFormFieldItemSettingsFnOption = {
  form: FormInstance;
  actions: OSFormAPI;
};

export interface OSFormFieldItemExtra extends OSCore {
  settings?: {
    /** 只读状态 */
    readonly?: boolean;
    /**
     * field-item col 会根据数量平均分
     * @default true
     */
    colAuto?: boolean;
    /** field-item 所占的 col 宽度 */
    colSpan?: number;
  };
}

export type CreatePureFormFieldItemConfigsType<T extends OSCore = OSCore> =
  CreatePureFormFieldItemConfigs<T, OSFormFieldItemSettingsFnOption, OSFormFieldItemExtra> &
    OSFormItemDependenciesConfigs;

export type _OSFormFieldItem<CustomValueType extends CreatePureFormFieldItemConfigsType> =
  | CustomValueType
  | (CreatePureFormFieldItemConfigs<
      OSDigitFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTreeSelectFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSMoneyFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSPercentFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSOptionFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTextFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSDateFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSRelativeDayFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTextareaFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSSwitchFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSRadioFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSDateRangeFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSActionsFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSSelectFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSFormGroupFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSCustomFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSChainSelectFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSImageFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTimeLagFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSTransferFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs);

export type OSFormGroupType<Children = _OSFormFieldItems<OSField>> = {
  key?: string;
  children?: Children;
};

export type _OSFormFieldItems<CustomValueType extends CreatePureFormFieldItemConfigsType> =
  (_OSFormFieldItem<CustomValueType> & OSFormGroupType<_OSFormFieldItems<CustomValueType>>)[];

export type OSFormAPI = {
  /** 清空用户输入最新的输入缓存 */
  clearPrevUserCellInputs: () => void;
  /** 异步获取 field-items 是否已经获取到数据 */
  isFieldItemsReady: () => boolean;
  /** 转换表单数据为一般数据，日期，target 等 */
  normalizeFieldsValue: (values: RecordType) => RecordType;
  /** 会触发 onChange，值为一般值 */
  setDataSource: (dataSource?: RecordType) => void;
  getDataSource: () => RecordType | undefined;
  updateContext: (data: RecordType) => void;
  getContext: () => RecordType;
  /** 修改字段值并触发联动 */
  setFieldsValueAndTriggeLinkage: (changedValues: RecordType) => void;
  /** 递归调用内部 forms 的 validate */
  validateRecursion: (nameList?: NamePath[]) => Promise<
    | {
        error: false;
        data: RecordType;
      }
    | {
        error: true;
        data: ValidateErrorEntity;
      }
  >;
  validate: (nameList?: NamePath[]) => Promise<
    | {
        error: false;
        data: RecordType;
      }
    | {
        error: true;
        data: ValidateErrorEntity;
      }
  >;
  getFieldsValue: (
    nameList?: NamePath[] | true,
    filterFunc?: (meta: Meta) => boolean,
  ) => RecordType;
  setFieldsValue: (
    values?: RecordType,
    options?: {
      /**
       * 是否更新组件输入缓存，比如 editable-table 的用户输入
       * @default true
       */
      cleanCache?: boolean;
    },
  ) => void;
} & Pick<FormInstance, 'resetFields' | 'getFieldsError'>;

export interface _OSFormType<
  CustomValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomValueType extends CreateStaticPureFormFieldItemConfigsType,
> extends OSCore {
  settings?: {
    changeDebounceTimestamp?: number;
    /**
     * 按照数组顺序进行 value 的改变
     */
    valueLinkage?: ValueLinkage[];
    valueAsyncLinkage?: {
      // 串行
      serial?: ValueAsyncLinkage[];
      // 并行
      parallel?: Record<string, ValueAsyncLinkage>;
    };
    initialValues?: Record<string, any>;
    fieldItems?: _OSFormFieldItems<CustomValueType>;
    labelCol?: FormItemProps['labelCol'];
    wrapperCol?: FormItemProps['wrapperCol'];
    layout?: FormProps['layout'];
    /** 公共的 fieldItems 配置，优先级比 fieldItems 低 */
    fieldItemSettings?: _OSFormFieldItemWithStaticPureConfigs<StaticCustomValueType>['settings'];
    /** 分组公共配置 */
    groupItemSettings?: OSFormGroupFieldType['settings'];
    /** requeset接口传参 */
    params?: {
      requestFieldItems?: RecordType;
    };
    /** 是否隐藏占位符 */
    hideEmpty?: boolean;
  };
  requests?: {
    /** 异步获取表单数据 */
    requestDataSource?: RequestIO<
      {
        actions: OSFormAPI;
      },
      RecordType
    >;
    /** 获取历史修改数据等额外信息，和 requestDataSource 一起只触发一次，优先级 requestRichDataSource 更高 */
    requestRichDataSource?: RequestIO<
      {
        actions: OSFormAPI;
      },
      {
        values?: RecordType;
        /** 历史修改数据 */
        history?: Record<string, OSFormItemInputHistoryData[]>;
      }
    >;
    /** 异步请求初始化数据 */
    requestInitialValues?: RequestIO<
      {
        actions: OSFormAPI;
      },
      RecordType
    >;
    requestFieldItems?: RequestIO<
      {
        actions: OSFormAPI;
        params?: RecordType;
      },
      {
        fieldItems: _OSFormFieldItems<CustomValueType>;
      }
    >;
  };
  name?: string;
  /** 值为原始值 */
  onValuesChange?: FormProps['onValuesChange'];
  onFieldsChange?: FormProps['onFieldsChange'];
  value?: RecordType;
  /** 值为原始值 */
  onChange?: (value?: RecordType) => void;
  /** 联动规则修改，值为原始值 */
  onValuesLinkageChange?: (changedValues: RecordType, values: RecordType) => void;
  /** 值为转换后的值，用户触发，setDataSource 不会触发 */
  onDataSourceChange?: (dataSource: RecordType) => void;
  /** 值为转换后的值，联动也会触发，setDataSource 不会触发 */
  onDataSourceLinkageChange?: (dataSource: RecordType) => void;
}

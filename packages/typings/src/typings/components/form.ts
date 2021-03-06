import type {
  OSAtomFieldType,
  OSSwitchFieldType,
  OSTimeLagFieldType,
  OSTreeSelectFieldValueType,
} from './field';
import type { FormInstance, FormItemProps, FormProps } from 'antd/lib/form';
import type { ValidateErrorEntity } from 'rc-field-form/es/interface';
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
  OSSelectFieldValueType,
  OSTextareaFieldType,
  OSTextFieldType,
  OSCustomFieldType,
  OSImageFieldType,
  OSRelativeDayFieldType,
  OSChainSelectFieldType,
  OSRadioFieldType,
  OSTransferFieldType,
  OSTreeSelectFieldType,
  OSPlaceholderInputFieldType,
  OSUploadFieldType,
} from './field';
import type { OSFormItemType } from './form-item';
import type { NamePath } from 'antd/lib/form/interface';
import type { Meta } from 'rc-field-form/es/interface';
import type { ValueAsyncLinkage, ValueLinkage } from './linkage';
import type { OSFormItemInputHistoryData } from './form-item';
import type { SizeType } from 'antd/es/config-provider/SizeContext';

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

/** settings ???????????? */
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
  | (CreateStaticPureFormFieldItemConfigs<
      OSSelectFieldType<
        OSSelectFieldValueType,
        {
          form?: FormInstance;
        }
      >,
      OSFormFieldItemExtra
    > &
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
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSPlaceholderInputFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<OSUploadFieldType, OSFormFieldItemExtra> &
      OSFormItemDependenciesConfigs)
  | (CreateStaticPureFormFieldItemConfigs<
      OSAtomFieldType<{
        form?: FormInstance;
      }>,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs);

export type OSFormFieldItemSettingsFnOption = {
  form: FormInstance;
  actions: OSFormAPI;
};

export interface OSFormFieldItemExtra extends OSCore {
  settings?: {
    /** ???????????? */
    readonly?: boolean;
    /**
     * field-item col ????????????????????????
     * @default true
     */
    colAuto?: boolean;
    /** field-item ????????? col ?????? */
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
      OSTreeSelectFieldType<
        OSTreeSelectFieldValueType,
        {
          form?: FormInstance;
        }
      >,
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
      OSSelectFieldType<
        OSSelectFieldValueType,
        {
          form?: FormInstance;
        }
      >,
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
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSPlaceholderInputFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSUploadFieldType,
      OSFormFieldItemSettingsFnOption,
      OSFormFieldItemExtra
    > &
      OSFormItemDependenciesConfigs)
  | (CreatePureFormFieldItemConfigs<
      OSAtomFieldType<
        {
          form?: FormInstance;
        },
        {
          form?: FormInstance;
        }
      >,
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

export type OSFormRefObjectAPIS = {
  setRefObject: (param: RecordType | ((prev: RecordType) => RecordType)) => RecordType;
  getRefObject: () => RecordType;
  mergeRefObject: (param: RecordType) => RecordType;
};

export type OSFormAPI = OSFormRefObjectAPIS & {
  /** ??????????????????????????????????????? */
  clearPrevUserCellInputs: () => void;
  /** ???????????? field-items ??????????????????????????? */
  isFieldItemsReady: () => boolean;
  /** ?????????????????????????????????????????????target ??? */
  normalizeFieldsValue: (values: RecordType) => RecordType;
  /** ????????? onChange?????????????????? */
  setDataSource: (dataSource?: RecordType) => void;
  getDataSource: (nameList?: NamePath[] | true) => RecordType | undefined;
  updateContext: (data: RecordType) => void;
  getContext: () => RecordType;
  /** ?????????????????????????????? */
  setFieldsValueAndTriggeLinkage: (changedValues: RecordType) => void;
  /** ?????????????????? forms ??? validate */
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
  /** nameList ?????? true?????????????????? values?????????????????????????????? */
  getFieldsValue: (
    nameList?: NamePath[] | true,
    filterFunc?: (meta: Meta) => boolean,
  ) => RecordType;
  setFieldsValue: (
    values?: RecordType,
    options?: {
      /**
       * ??????????????????????????????????????? editable-table ???????????????
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
    size?: SizeType;
    changeDebounceTimestamp?: number;
    /**
     * ???????????????????????? value ?????????
     */
    valueLinkage?: ValueLinkage[];
    valueAsyncLinkage?: {
      // ??????
      serial?: ValueAsyncLinkage[];
      // ??????
      parallel?: Record<string, ValueAsyncLinkage>;
    };
    initialValues?: Record<string, any>;
    fieldItems?: _OSFormFieldItems<CustomValueType>;
    labelCol?: FormItemProps['labelCol'];
    wrapperCol?: FormItemProps['wrapperCol'];
    layout?: FormProps['layout'];
    /** ????????? fieldItems ????????????????????? fieldItems ??? */
    fieldItemSettings?: _OSFormFieldItemWithStaticPureConfigs<StaticCustomValueType>['settings'];
    /** ?????????????????? */
    groupItemSettings?: OSFormGroupFieldType['settings'];
    /** requeset???????????? */
    params?: {
      requestFieldItems?: RecordType;
    };
    /** ????????????????????? */
    hideEmpty?: boolean;
  };
  requests?: {
    /** ???????????????????????? */
    requestDataSource?: RequestIO<
      {
        actions: OSFormAPI;
      },
      RecordType
    >;
    /** ????????????????????????????????????????????? requestDataSource ????????????????????????????????? requestRichDataSource ?????? */
    requestRichDataSource?: RequestIO<
      {
        actions: OSFormAPI;
      },
      {
        values?: RecordType;
        /** ?????????????????? */
        history?: Record<string, OSFormItemInputHistoryData[]>;
      }
    >;
    /** ??????????????????????????? */
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
  /** ??????????????? */
  onValuesChange?: FormProps['onValuesChange'];
  onFieldsChange?: FormProps['onFieldsChange'];
  value?: RecordType;
  /** ??????????????? */
  onChange?: (value?: RecordType) => void;
  /** ???????????????????????????????????? */
  onValuesLinkageChange?: (changedValues: RecordType, values: RecordType) => void;
  /** ???????????????????????????????????????setDataSource ???????????? */
  onDataSourceChange?: (dataSource: RecordType) => void;
  /** ?????????????????????????????????????????????setDataSource ???????????? */
  onDataSourceLinkageChange?: (dataSource: RecordType) => void;
}

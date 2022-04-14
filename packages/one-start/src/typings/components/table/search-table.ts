import type { FixedType } from 'rc-table/lib/interface';
import type { RecordType } from '../../core';
import type { RequestIO } from '../core';
import type {
  CreatePureFormFieldItemConfigsType,
  CreateStaticPureFormFieldItemConfigsType,
  _OSFormType,
} from '../form';
import type { OSResMessage } from '../message';
import type { _OSSourceTableType } from './source-table';
import type {
  ColumnOrdersMetaType,
  CreatePureTableFormFieldItemConfigsType,
  OSTableChangeValueType,
  OSTableValueType,
  _OSTableAPI,
} from './table';

export type _OSSearchTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type _OSSearchTableSelfType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> = {
  settings?: {
    /** 设置搜索模板 */
    searchTempldateable?: {
      /** 模板名称 key */
      templateNameKey?: string;
      /** 模板管理字段 */
      templateManagementTableFieldItems?: Required<
        _OSSourceTableType<
          OSCustomFieldStaticPureTableFormFieldItemConfigsType,
          CustomTableValueType,
          CustomFormValueType,
          StaticCustomFormValueType,
          Value,
          ChangeValue
        >
      >['settings']['fieldItems'];
      /** 创建模板字段 */
      createFormFieldItems?: Required<
        _OSFormType<CustomFormValueType, StaticCustomFormValueType>
      >['settings']['fieldItems'];
      /** 编辑模板字段 */
      editFormFieldItems?: Required<
        _OSFormType<CustomFormValueType, StaticCustomFormValueType>
      >['settings']['fieldItems'];
    };
  };
  requests?: {
    /** 请求更新当前搜索模板 */
    requestUpdateSearchTempldate?: RequestIO<
      {
        id: string;
        searchValues?: RecordType;
        columnsVisibleMap?: Record<string, boolean>;
        columnsFixedsMap?: Record<string, FixedType | undefined>;
        columnsOrders?: ColumnOrdersMetaType;
      },
      {
        message?: OSResMessage;
      }
    >;
    /** 请求当前应用的模板数据 */
    requestApplayTemplateSearchValues?: RequestIO<
      {
        id: string;
      },
      {
        searchDataSource?: RecordType;
        message?: OSResMessage;
        columnsVisibleMap?: Record<string, boolean>;
        columnsFixedsMap?: Record<string, FixedType | undefined>;
        columnsOrders?: ColumnOrdersMetaType;
      }
    >;
    /** 请求创建搜索模板 */
    requestCreateTemplate?: RequestIO<
      {
        values?: RecordType;
        searchDataSource?: RecordType;
        columnsVisibleMap?: Record<string, boolean>;
        columnsFixedsMap?: Record<string, FixedType | undefined>;
        columnsOrders?: ColumnOrdersMetaType;
      },
      {
        message?: OSResMessage;
        tplId: string;
        tplName?: string;
      }
    >;
    /** 请求模板列表 */
    requestTemplateDataSource?: Required<
      _OSSourceTableType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType,
        CustomFormValueType,
        StaticCustomFormValueType,
        Value,
        ChangeValue
      >
    >['requests']['requestDataSource'];
    /** 请求删除模版 */
    requestRemoveTemplate?: Required<
      _OSSourceTableType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType,
        CustomFormValueType,
        StaticCustomFormValueType,
        Value,
        ChangeValue
      >
    >['requests']['requestRemoveRow'];
    /** 请求编辑模版初始化数据 */
    requestRowEditTemplate?: Required<
      _OSSourceTableType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType,
        CustomFormValueType,
        StaticCustomFormValueType,
        Value,
        ChangeValue
      >
    >['requests']['requestRowEditData'];
    /** 请求保存模板基本信息 */
    requestSaveRowTemplate?: Required<
      _OSSourceTableType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        CustomTableValueType,
        CustomFormValueType,
        StaticCustomFormValueType,
        Value,
        ChangeValue
      >
    >['requests']['requestSaveRowData'];
  };
};

export type _OSSearchTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
  Value = OSTableValueType,
  ChangeValue = OSTableChangeValueType,
> = _OSSearchTableSelfType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType,
  CustomFormValueType,
  StaticCustomFormValueType,
  Value,
  ChangeValue
> &
  _OSSourceTableType<
    OSCustomFieldStaticPureTableFormFieldItemConfigsType,
    CustomTableValueType,
    CustomFormValueType,
    StaticCustomFormValueType,
    Value,
    ChangeValue
  >;

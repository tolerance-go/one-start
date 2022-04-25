import type { RcFile } from 'antd/lib/upload';
import type { RequiredRecursion } from '../utils';
import type { RequestIO } from './core';
import type { RecordType } from '../core';
import type {
  CreatePureFormFieldItemConfigsType,
  CreateStaticPureFormFieldItemConfigsType,
} from './form';
import type { OSResMessage } from './message';
import type {
  CreatePureTableFormFieldItemConfigsType,
  OSTableChangeValueType,
  OSTableValueType,
  _OSTableAPI,
  _OSTableType,
} from './table';
import type { OSMenuItem, OSTriggerButtonType, OSTriggerTooltip, OSTriggerType } from './trigger';

export type _OSEditableTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSEditableTableAddable = {
  /** 从顶部创建还是从底部创建 */
  direction?: 'top' | 'bottom';
  /** 创建按钮文案 */
  addButtonText?: string;
  /** 是否禁用新增按钮 */
  addButtonDisabled?: boolean;
  /** 是否上传新增 */
  upload?: RequiredRecursion<OSTriggerButtonType>['settings']['upload'];
  menu?: OSMenuItem[];
  tooltip?: OSTriggerTooltip;
  addTriggerSettings?: OSTriggerType['settings'];
};

export type _OSEditableTableSelfType<OSCustomFieldStaticPureTableFormFieldItemConfigsType> = {
  settings?: {
    /**
     * 启动自增项目
     */
    addable?:
      | OSEditableTableAddable
      | ((options: {
          dataSource?: OSTableValueType;
          actions: _OSEditableTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
        }) => OSEditableTableAddable)
      | false;
    removeable?:
      | {
          /** 删除按钮的配置 */
          triggerSettings?: OSTriggerType['settings'];
        }
      | false
      | ((options: {
          rowData: RecordType;
          rowIndex: number;
          rowId: string;
          actions: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
          dataSource?: OSTableValueType;
        }) => {
          /** 删除按钮的配置 */
          triggerSettings?: OSTriggerType['settings'];
        });
    /**
     * 对应 request 的 params 参数
     * @example
     * {
     *   requestParams: {
     *      requestNewRecordData: {
     *        productType: form.getFieldValue('productType'),
     *      },
     *    },
     * }
     */
    requestParams?: Record<string, RecordType>;
  };
  requests?: {
    /** 控制新增行的内容 */
    requestNewRecordData?: RequestIO<
      {
        dataSource?: OSTableValueType;
        rowData: RecordType & {
          file?: RcFile;
        };
        menuItemKey?: string;
        params?: RecordType;
      },
      RecordType
    >;
    /** 删除行，返回 error 为 true 时，删除失败 */
    requestRemoveRecord?: RequestIO<
      {
        rowId?: string;
        rowData?: RecordType;
        rowIndex?: number;
        dataSource?: OSTableValueType;
        actions?: _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;
      },
      {
        message?: OSResMessage;
      }
    >;
  };
};

export type _OSEditableTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
> = _OSTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType,
  CustomFormValueType,
  StaticCustomFormValueType,
  OSTableChangeValueType,
  OSTableChangeValueType
> &
  _OSEditableTableSelfType<OSCustomFieldStaticPureTableFormFieldItemConfigsType> & {
    extraAddable?: OSEditableTableAddable;
  };

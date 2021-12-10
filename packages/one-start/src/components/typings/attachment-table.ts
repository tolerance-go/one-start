import type { _OSEditableTableSelfType, _OSEditableTableType } from './editable-table';
import type {
  CreatePureFormFieldItemConfigsType,
  CreateStaticPureFormFieldItemConfigsType,
} from './form';
import type { CreatePureTableFormFieldItemConfigsType, _OSTableAPI } from './table';
import type { OSEditableTableAddable } from './editable-table';
import type { RequestIO } from './core';
import type { RcFile } from '@ty/antd/lib/upload';
import type { RecordType } from './core';

export type _OSAttachmentTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSTableAPI<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

export type OSAttachmentTableAddable = OSEditableTableAddable;

export type _OSAttachmentTableSelfType<OSCustomFieldStaticPureTableFormFieldItemConfigsType> =
  _OSEditableTableSelfType<OSCustomFieldStaticPureTableFormFieldItemConfigsType> & {
    settings?: {
      /** 启动行附件下载  */
      downloadable?: {};
      /** 启动批量附件下载 */
      batchDownload?: {};
    };
    requests?: {
      /** 行下载 */
      requestDownload?: RequestIO<
        {
          rowData: RecordType & { file: RcFile };
          rowId: string;
          rowIndex: number;
        },
        {
          message?: string;
        }
      >;
      /** 批量行下载 */
      requestBatchDownload?: RequestIO<
        {
          selectedRowKeys: React.Key[];
          selectedRows: RecordType[];
        } & { files: RcFile[] },
        {
          message?: string;
        }
      >;
    };
  };

export type _OSAttachmentTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType extends CreatePureTableFormFieldItemConfigsType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
  CustomFormValueType extends CreatePureFormFieldItemConfigsType,
  StaticCustomFormValueType extends CreateStaticPureFormFieldItemConfigsType,
> = _OSEditableTableType<
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  CustomTableValueType,
  CustomFormValueType,
  StaticCustomFormValueType
> &
  _OSAttachmentTableSelfType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>;

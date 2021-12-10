import { message } from '@ty/antd';
import cls from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React from 'react';
import OSEditableTable from '../editable-table';
import OSTrigger from '../trigger';
import type {
  OSAttachmentTableAPI,
  OSAttachmentTableSelfType,
  OSAttachmentTableType,
} from '../typings';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { useClsPrefix } from '../utils/use-cls-prefix';

const OSAttachmentTable: React.ForwardRefRenderFunction<
  OSAttachmentTableAPI,
  OSAttachmentTableType
> = (props, ref) => {
  const { settings, requests, value, onChange, extraRowActions, extraBatchOperation } = props;
  const { downloadable, batchDownload } = settings ?? {};
  const clsPrefix = useClsPrefix('attachment-table');

  const [dataSource, setDataSource] = useMergedState(value, {
    value,
    onChange,
  });

  return (
    <OSEditableTable
      ref={ref}
      value={dataSource}
      onChange={setDataSource}
      {...props}
      className={cls(clsPrefix, props.className)}
      extraAddable={{
        addButtonText: '添加新附件',
        upload: {},
      }}
      extraBatchOperation={(options) => {
        const { selectedRowKeys, selectedRows } = options;
        return [
          ...(extraBatchOperation?.(options) ?? []),
          batchDownload ? (
            <OSTrigger
              type="button"
              settings={{
                text: '批量下载',
                type: 'primary',
              }}
              requests={{
                requestAfterClick: async () => {
                  const { error, data } =
                    (await requests
                      ?.requestBatchDownload?.({
                        selectedRowKeys,
                        selectedRows,
                        files: options.selectedRows.map((item) => item.file),
                      })
                      .then(normalizeRequestOutputs)) ?? {};

                  if (!error && data?.message) {
                    message.success(data.message);
                  }
                  return error;
                },
              }}
            ></OSTrigger>
          ) : null,
        ];
      }}
      extraRowActions={(options) => {
        const { rowData, rowId, rowIndex } = options;
        return [
          ...(extraRowActions?.(options) ?? []),
          downloadable ? (
            <OSTrigger
              type="button"
              settings={{
                text: '下载',
                type: 'link',
              }}
              requests={{
                requestAfterClick: async () => {
                  const { error, data } =
                    (await requests
                      ?.requestDownload?.({
                        rowData: {
                          ...rowData,
                          file: rowData.file,
                        },
                        rowId,
                        rowIndex,
                      })
                      .then(normalizeRequestOutputs)) ?? {};

                  if (!error && data?.message) {
                    message.success(data.message);
                  }
                  return error;
                },
              }}
            ></OSTrigger>
          ) : null,
        ];
      }}
    />
  );
};

export default React.forwardRef(OSAttachmentTable);
export const Settings: React.FC<OSAttachmentTableSelfType['settings']> = () => <></>;
export const Requests: React.FC<OSAttachmentTableSelfType['requests']> = () => <></>;

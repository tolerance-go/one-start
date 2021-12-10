import type { RecordType } from '@ty-one-start/one-start';
import { OSAttachmentTable, OSProviderWrapper, parseTableValue } from '@ty-one-start/one-start';
import delay from 'delay';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>([]);
  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSAttachmentTable
        value={value}
        onChange={(e) => setValue(parseTableValue(e))}
        settings={{
          addable: ({ dataSource }) => ({
            menu: [
              {
                text: '上传附件-单章',
                key: 'single',
                disabled: !!dataSource?.find((item) => item.type === 'single'),
                upload: {
                  multiple: true,
                  suffixs: ['.xlsx'],
                },
              },
              {
                text: '上传附件-双章',
                key: 'double',
                upload: {
                  multiple: true,
                  suffixs: ['.xlsx'],
                },
              },
              {
                text: '上传附件-其他',
                key: 'other',
                upload: {
                  multiple: true,
                  suffixs: ['.xlsx'],
                },
              },
            ],
            tooltip: [
              '1. 单章，双章上传导入仅支持 .pdf 格式',
              '2. 若无需或其他格式文件上传，请通过其他类型上传',
            ],
          }),
          batchDownload: {},
          removeable: {},
          downloadable: {},
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: 'fileName',
                title: '文件名称',
                editable: true,
                autoFocus: true,
              },
            },
            {
              type: 'text',
              settings: {
                dataIndex: 'fileType',
                title: '附件类型',
                editable: false,
              },
            },
            {
              type: 'text',
              settings: {
                dataIndex: 'fileLastModifiedDate',
                title: '附件更新时间',
                editable: false,
              },
            },
            {
              type: 'text',
              settings: {
                dataIndex: 'creator',
                title: '创建人',
                editable: false,
              },
            },
          ],
        }}
        requests={{
          requestNewRecordData: async ({ rowData, menuItemKey }) => {
            const { file } = rowData;
            return {
              error: false,
              data: {
                ...rowData,
                fileName: file?.name.split('.')[0],
                fileType: file?.type,
                fileLastModifiedDate: file?.lastModifiedDate.toDateString(),
                creator: 'yarnb',
                type: menuItemKey,
              },
            };
          },
          requestDownload: async () => {
            await delay(1000);
            return {
              error: false,
              data: {
                message: '下载成功',
              },
            };
          },
        }}
      ></OSAttachmentTable>
    </OSProviderWrapper>
  );
};

import type { RecordType } from '@ty-one-start/one-start';
import {
  OSAttachmentTableField,
  OSProviderWrapper,
  parseTableValue,
} from '@ty-one-start/one-start';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>([]);
  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSAttachmentTableField
        value={value}
        onChange={(e) => {
          setValue(parseTableValue(e));
        }}
        mode="edit"
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: ['file', 'name'],
                title: 'fileName',
                editable: false,
              },
            },
            {
              type: 'text',
              settings: {
                dataIndex: ['file', 'size'],
                title: 'fileSize',
                editable: false,
              },
            },
            {
              type: 'text',
              settings: {
                dataIndex: ['file', 'type'],
                title: 'fileType',
                editable: false,
              },
            },
          ],
        }}
      ></OSAttachmentTableField>
    </OSProviderWrapper>
  );
};

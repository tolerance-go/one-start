import type { RecordType } from '@ty-one-start/one-start';
import {
  OSAttachmentTableField,
  OSProviderWrapper,
  parseTableValue,
} from '@ty-one-start/one-start';
import { Divider } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<RecordType[] | undefined>([
    {
      id: '1asdfasdf',
    },
  ]);
  return (
    <OSProviderWrapper>
      {JSON.stringify(value)}
      <OSAttachmentTableField
        value={value}
        onChange={(e) => setValue(parseTableValue(e))}
        mode="edit"
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: 'text',
                title: 'text',
                autoFocus: true,
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
              },
            },
          ],
        }}
      ></OSAttachmentTableField>
      <Divider></Divider>
      <OSAttachmentTableField
        value={value}
        mode="read"
        settings={{
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: 'text',
                title: 'text',
                autoFocus: true,
              },
            },
            {
              type: 'date',
              settings: {
                title: 'date',
                dataIndex: 'date',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'digit',
                dataIndex: 'digit',
              },
            },
          ],
        }}
      ></OSAttachmentTableField>
    </OSProviderWrapper>
  );
};

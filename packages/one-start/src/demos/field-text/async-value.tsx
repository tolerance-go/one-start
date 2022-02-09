import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import React, { useRef, useState } from 'react';

export default () => {
  const [values, setValues] = useState<RecordType | undefined>();
  const formRef = useRef<OSFormAPI>(null);
  return (
    <OSProviderWrapper>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <OSForm
        ref={formRef}
        value={values}
        onChange={setValues}
        settings={{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
          fieldItems: [
            {
              type: 'select',
              settings: {
                title: 'select',
                dataIndex: 'select',
                valueEnums: {
                  a: 'A',
                  b: 'B',
                  c: 'C',
                },
              },
            },
            {
              type: 'text',
              settings: ({ form }) => ({
                title: 'text',
                dataIndex: 'text',
                requestParams: {
                  requestTextValue: {
                    select: form.getFieldValue('select'),
                  },
                },
              }),
              requests: {
                requestTextValue: async ({ params }) => {
                  return {
                    error: false,
                    data: {
                      text: params?.select,
                    },
                  };
                },
              },
            },
          ],
        }}
      />
    </OSProviderWrapper>
  );
};

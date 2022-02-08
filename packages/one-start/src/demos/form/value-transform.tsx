import type { RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { mock, Random } from 'mockjs';
import React, { useState } from 'react';

const placeholders = mock({
  'list|20': [
    {
      label: () => Random.word(),
      value() {
        return this.label;
      },
    },
  ],
}).list;

export default () => {
  const [values, setValues] = useState<RecordType | undefined>({});

  return (
    <OSProviderWrapper>
      <div>{JSON.stringify(values)}</div>
      <OSForm
        value={values}
        onChange={setValues}
        settings={{
          fieldItems: [
            {
              type: 'placeholder-input',
              settings: {
                title: 'a',
                dataIndex: 'a',
                placeholders,
                valueTransform: (value) => {
                  const items = value.match(
                    /{[a-zA-Z0-9\u4e00-\u9fa5`~!@#$%^&*()-_=+|[\]:;"'<>,.?]+}/g,
                  ) ?? [value];
                  console.log('🚀 ~ file: value-transform.tsx ~ line 53 ~ items', items);
                  return items[items.length - 1];
                },
              },
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

/**
 * desc: 当 money 当值大于 100 的时候，隐藏相关字段，注意 dependencies 必须和函数形式 settings 同时出现
 */
import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSTrigger } from '@ty-one-start/one-start';
import React, { useRef, useState } from 'react';

export default () => {
  const ref = useRef<OSFormAPI>(null);
  const [values, setValues] = useState<RecordType>();
  return (
    <OSProviderWrapper>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <OSTrigger
        type="button"
        settings={{
          text: '获取当前表单值',
        }}
        onClick={async () => {
          if (!ref.current) return;
          const { error, data } = await ref.current.validate();
          if (!error) {
            setValues(data as RecordType);
          }
        }}
      />
      <OSForm
        ref={ref}
        settings={{
          fieldItems: [
            {
              type: 'group',
              settings: {
                title: '分组1',
              },
              children: [
                {
                  type: 'money',
                  settings: {
                    title: 'money',
                    dataIndex: 'money',
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'option',
                  settings: {
                    dataIndex: 'option2-2',
                  },
                },
                {
                  type: 'date',
                  dependencies: ['money'],
                  settings: ({ form }) => ({
                    title: 'date',
                    dataIndex: 'date',
                    hide: form.getFieldValue('money') >= 100,
                  }),
                },
                {
                  type: 'date-range',
                  settings: {
                    title: 'date-range',
                    dataIndex: 'date-range',
                  },
                },
              ],
            },
            {
              type: 'group',
              settings: {
                title: '不同 type，相同 dataIndex',
              },
              children: [
                {
                  type: 'text',
                  dependencies: ['money'],
                  settings: ({ form }) => ({
                    title: 'same-text',
                    dataIndex: 'same',
                    key: 'sameText',
                    hide: form.getFieldValue('money') >= 100,
                  }),
                },
                {
                  type: 'select',
                  dependencies: ['money'],
                  settings: ({ form }) => ({
                    title: 'same-select',
                    dataIndex: 'same',
                    key: 'sameSelect',
                    valueEnums: {
                      a: 'A',
                      b: 'B',
                      c: 'C',
                    },
                    hide: form.getFieldValue('money') < 100,
                  }),
                },
              ],
            },
            {
              type: 'group',
              settings: {
                title: '切换隐藏，自动调整栅格布局',
                key: 'group-10',
              },
              children: [
                {
                  type: 'date',
                  settings: {
                    title: 'date1-0',
                    dataIndex: 'date1-0',
                    hide: true,
                    colSpan: 8,
                  },
                },
                {
                  type: 'date',
                  dependencies: ['money'],
                  settings: ({ form }) => ({
                    title: 'date2-0',
                    dataIndex: 'date2-0',
                    hide: form.getFieldValue('money') >= 100,
                    colSpan: 8,
                  }),
                },
                {
                  type: 'date',
                  settings: {
                    title: 'date3-0',
                    dataIndex: 'date3-0',
                    colSpan: 8,
                  },
                },
                {
                  type: 'date',
                  settings: {
                    title: 'date4-0',
                    dataIndex: 'date4-0',
                    colSpan: 8,
                  },
                },
                {
                  type: 'date',
                  settings: {
                    title: 'date5-0',
                    dataIndex: 'date5-0',
                    colSpan: 8,
                  },
                },
              ],
            },
          ],
        }}
      ></OSForm>
    </OSProviderWrapper>
  );
};

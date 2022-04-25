import type { RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { Divider } from 'antd';
import { mock, Random } from 'mockjs';
import moment from 'moment';
import React, { useState } from 'react';

export default () => {
  const [settings, setSettings] = useState<RecordType | undefined>({
    layout: 'horizontal',
    gutter: 200,
    labelAlign: 'left',
    readonly: true,
    colSpan: 8,
  });
  return (
    <OSProviderWrapper>
      <OSForm
        value={settings}
        onValuesChange={(__, values) => setSettings(values)}
        settings={{
          fieldItems: [
            {
              type: 'digit',
              settings: {
                title: 'groupItemSettings.gutter',
                dataIndex: 'gutter',
              },
            },
            {
              type: 'radio',
              settings: {
                title: 'fieldItemSettings.labelAlign',
                dataIndex: 'labelAlign',
                valueEnums: {
                  left: 'left',
                  right: 'right',
                },
              },
            },
            {
              type: 'switch',
              settings: {
                title: 'fieldItemSettings.readonly',
                dataIndex: 'readonly',
              },
            },
            {
              type: 'digit',
              settings: {
                title: 'fieldItemSettings.colSpan',
                dataIndex: 'colSpan',
              },
            },
            {
              type: 'radio',
              settings: {
                title: 'layout',
                dataIndex: 'layout',
                valueEnums: {
                  horizontal: 'horizontal',
                  inline: 'inline',
                  vertical: 'vertical',
                },
              },
            },
          ],
        }}
      ></OSForm>
      <Divider />
      <OSForm
        settings={{
          initialValues: mock({
            gutter: () => Random.integer(),
            money: () => Random.integer(),
            'relative-day': () => Random.integer(),
            text: () => Random.csentence(),
            textarea: () => Random.cparagraph(),
            'tree-select': () => Random.integer(),
            switch: () => Random.pick([true, false]),
            bookName: () => Random.integer(),
            select: () => Random.integer(),
            date: () => moment(),
            'date-range': () => [moment().subtract(7, 'd'), moment()],
            digit: () => Random.integer(),
            percent: () => Random.integer(),
            radio: () => Random.pick(['a', 'b']),
          }),
          groupItemSettings: {
            gutter: settings?.gutter,
          },
          fieldItemSettings: {
            labelAlign: settings?.labelAlign,
            readonly: settings?.readonly,
            colSpan: settings?.colSpan,
          },
          layout: settings?.layout,
          fieldItems: [
            {
              type: 'group',
              settings: {
                title: '分组',
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
                  type: 'relative-day',
                  settings: {
                    title: 'relative-day',
                    dataIndex: 'relative-day',
                  },
                },
                {
                  type: 'text',
                  settings: {
                    title: 'text',
                    dataIndex: 'text',
                  },
                },
                {
                  type: 'textarea',
                  settings: {
                    title: 'textarea',
                    dataIndex: 'textarea',
                  },
                },
                {
                  type: 'tree-select',
                  settings: {
                    title: 'tree-select',
                    dataIndex: 'tree-select',
                    treeOptions: [
                      {
                        value: 'p',
                        label: 'P',
                        children: [
                          { value: 'a', label: 'A' },
                          { value: 'b', label: 'B' },
                          { value: 'c', label: 'C' },
                        ],
                      },
                    ],
                  },
                },
                {
                  type: 'switch',
                  settings: {
                    title: 'switch',
                    dataIndex: 'switch',
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'percent',
                  settings: {
                    title: 'relative-day',
                    dataIndex: 'bookName',
                  },
                },
                {
                  type: 'select',
                  settings: {
                    title: 'select',
                    dataIndex: 'select',
                    valueEnums: {
                      a: 'A',
                      b: 'B',
                    },
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
                  type: 'date-range',
                  settings: {
                    title: 'date-range',
                    dataIndex: 'date-range',
                  },
                },
                {
                  type: 'digit',
                  settings: {
                    title: 'digit',
                    dataIndex: 'digit',
                  },
                },
                {
                  type: 'percent',
                  settings: {
                    title: 'percent',
                    dataIndex: 'percent',
                  },
                },
                {
                  type: 'radio',
                  settings: {
                    title: 'radio',
                    dataIndex: 'radio',
                    valueEnums: {
                      a: 'A',
                      b: 'B',
                      c: 'C',
                    },
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

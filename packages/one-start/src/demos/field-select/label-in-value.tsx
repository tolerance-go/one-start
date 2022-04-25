import type { OSSelectFieldValueType, RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import { Divider } from 'antd';
import { mock } from 'mockjs';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSSelectFieldValueType>();
  const [settings, setSettings] = useState<undefined | RecordType>({
    labelInValue: false,
  });

  return (
    <OSProviderWrapper>
      <OSForm
        value={settings}
        onChange={(next) => {
          setValue(undefined);
          setSettings(next);
        }}
        settings={{
          fieldItems: [
            {
              type: 'switch',
              settings: {
                title: 'labelInValue',
                dataIndex: 'labelInValue',
              },
            },
          ],
        }}
      />
      <Divider />
      <pre>{JSON.stringify(value, null, 2)}</pre>
      <OSSelectField
        mode="edit"
        value={value}
        onChange={(next) => {
          console.log(next);
          setValue(next);
        }}
        settings={{
          mode: 'multiple',
          labelInValue: settings?.labelInValue,
        }}
        requests={{
          requestOptions: async () => {
            return mock({
              error: false,
              'data|20': [
                {
                  data: {
                    name: '@word',
                  },
                  label: '@word',
                  value: '@word',
                },
              ],
            });
          },
        }}
      />
    </OSProviderWrapper>
  );
};

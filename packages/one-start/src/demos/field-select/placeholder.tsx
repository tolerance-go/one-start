import type { OSSelectFieldValueType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper, OSSelectField } from '@ty-one-start/one-start';
import { Divider, Space } from 'antd';
import delay from 'delay';
import { mock } from 'mockjs';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSSelectFieldValueType>();

  const [settings, setSettings] = useState({
    type: 'noOption',
  });

  return (
    <OSProviderWrapper>
      <OSForm
        onValuesChange={(_, values_) => {
          setSettings(values_);
        }}
        settings={{
          initialValues: settings,
          fieldItems: [
            {
              type: 'radio',
              settings: {
                dataIndex: 'type',
                title: '占位状态',
                valueEnums: {
                  noOption: '暂无选项',
                  dataRequest: '数据请求中',
                  unqualifiedMatching: '未查询到匹配项',
                },
              },
            },
          ],
        }}
      />
      <Divider />
      <Space>
        <OSSelectField
          key={settings.type}
          mode="edit"
          value={value}
          onChange={(next) => {
            console.log(next);
            setValue(next);
          }}
          settings={{
            mode: 'multiple',
            showSearch: true,
          }}
          requests={{
            requestOptions: (() => {
              if (settings.type === 'dataRequest') {
                return async () => {
                  await delay(5000);
                  return mock({
                    error: false,
                    data: [],
                  });
                };
              }

              if (settings.type === 'unqualifiedMatching') {
                return async () => {
                  return mock({
                    error: false,
                    data: [],
                  });
                };
              }

              return undefined;
            })(),
          }}
        />
      </Space>
    </OSProviderWrapper>
  );
};

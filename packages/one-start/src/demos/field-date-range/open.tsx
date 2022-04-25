/**
 * desc: 自测存在 bug https://github.com/ant-design/ant-design/issues/32134
 */
import type { OSDateRangeFieldInputAPI, OSDateRangeFieldValueType } from '@ty-one-start/one-start';
import { OSDateRangeField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Button, Space } from 'antd';
import React, { useState, useRef } from 'react';

export default () => {
  const [value, setValue] = useState<OSDateRangeFieldValueType>();
  const ref = useRef<OSDateRangeFieldInputAPI>(null);

  return (
    <OSProviderWrapper>
      <Space direction="vertical">
        <Space>
          <Button
            onClick={() => {
              ref.current?.open();
              ref.current?.focus();
            }}
          >
            open
          </Button>
        </Space>
        <Space split="|">
          <OSDateRangeField
            ref={ref}
            value={value}
            onChange={setValue}
            mode="edit"
          ></OSDateRangeField>
        </Space>
      </Space>
    </OSProviderWrapper>
  );
};

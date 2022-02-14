import type { OSUploadFieldValueType } from '@ty-one-start/one-start';
import { OSProviderWrapper, OSUploadField } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSUploadFieldValueType>();
  const [value2, setValue2] = useState<OSUploadFieldValueType>();

  return (
    <OSProviderWrapper>
      <pre>{JSON.stringify(value?.map((item) => item.name))}</pre>
      <pre>{JSON.stringify(value2?.map((item) => item.name))}</pre>
      <Space split="|">
        <OSUploadField
          value={value}
          onChange={setValue}
          mode="edit"
          settings={{
            maxSize: 1,
          }}
        ></OSUploadField>
        <OSUploadField
          value={value2}
          onChange={setValue2}
          mode="edit"
          settings={{
            maxSize: 1,
            multiple: true,
            triggerButtonText: '多选上传',
          }}
        ></OSUploadField>
      </Space>
    </OSProviderWrapper>
  );
};

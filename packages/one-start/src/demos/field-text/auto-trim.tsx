import type { OSTextFieldAPI } from '@ty-one-start/one-start';
import { OSTextField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useEffect, useRef, useState } from 'react';

export default () => {
  const [value, setValue] = useState<string>();
  const ref = useRef<OSTextFieldAPI>(null);

  useEffect(() => {
    console.log('🚀 ~ file: auto-trim.tsx ~ line 8 ~ ref', ref);
  }, []);

  return (
    <OSProviderWrapper>
      <Space split="|">
        <OSTextField
          ref={ref}
          value={value}
          onChange={(e) => setValue(e?.target.value)}
          mode="edit"
        ></OSTextField>
        <OSTextField value={value} mode="read"></OSTextField>
      </Space>
    </OSProviderWrapper>
  );
};

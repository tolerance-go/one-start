/**
 * debug: true
 */
import { OSProviderWrapper, OSSelectField, OSSelectFieldValueType } from '@ty-one-start/one-start';
import { Divider, Typography } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<OSSelectFieldValueType>();

  return (
    <OSProviderWrapper>
      <Typography.Paragraph>快捷清空的时候，测试 onChange 的值是什么</Typography.Paragraph>
      <OSSelectField
        mode="edit"
        value={value}
        onChange={(next) => {
          alert(JSON.stringify(next));
          setValue(next);
        }}
        settings={{
          valueEnums: {
            a: 'A',
            b: 'B',
            c: 'C',
          },
          allowClear: true,
        }}
      ></OSSelectField>
      <Divider />
    </OSProviderWrapper>
  );
};

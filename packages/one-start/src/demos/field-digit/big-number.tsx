import { OSDigitField, OSProviderWrapper } from '@ty-one-start/one-start';
import { Typography } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string | number>();

  return (
    <OSProviderWrapper>
      <Typography.Text>value 的类型: {typeof value}</Typography.Text>
      <OSDigitField
        value={value}
        onChange={setValue}
        mode="edit"
        settings={{
          stringMode: true,
        }}
      ></OSDigitField>
      <Typography.Text></Typography.Text>
      <OSDigitField value={value} onChange={setValue} mode="edit"></OSDigitField>
    </OSProviderWrapper>
  );
};

/**
 * title: field-digit-base
 * desc: 底层 digit 组件，同时支持 money 和 percent
 * debug: true
 */
import { OSDigitFieldBase, OSProviderWrapper, utils } from '@ty-one-start/one-start';
import { Space } from '@ty/antd';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState<string | number>();

  return (
    <OSProviderWrapper>
      <Space direction="vertical">
        <Space split={'|'}>
          展示
          <OSDigitFieldBase
            mode="read"
            settings={{
              addon: 'CNY',
            }}
          ></OSDigitFieldBase>
          <OSDigitFieldBase
            value={100}
            mode="read"
            settings={{
              addon: 'CNY',
            }}
          ></OSDigitFieldBase>
          <OSDigitFieldBase
            value={100}
            mode="read"
            settings={{
              addon: 'CNY',
              addonPlacement: 'after',
            }}
          ></OSDigitFieldBase>
        </Space>
        <Space split={'|'}>
          单位
          <OSDigitFieldBase
            value={100}
            mode="edit"
            settings={{
              addon: 'CNY',
              addonPlacement: 'after',
            }}
          ></OSDigitFieldBase>
          <OSDigitFieldBase
            value={100}
            mode="edit"
            settings={{
              addon: 'CNY',
            }}
          ></OSDigitFieldBase>
        </Space>
        <Space split={'|'}>
          格式化
          <OSDigitFieldBase
            value={value}
            onChange={setValue}
            mode="edit"
            settings={{
              addon: 'CNY',
            }}
            formatter={utils.formatter}
            parser={utils.parser}
          ></OSDigitFieldBase>
        </Space>
        <Space split={'|'}>
          value 转换
          <OSDigitFieldBase
            value={value}
            onChange={setValue}
            mode="edit"
            settings={{
              addon: 'CNY',
            }}
            formatter={utils.formatter}
            parser={utils.parser}
            transformValue={(val) => (typeof val === 'number' ? val * 100 : 0)}
            parseValue={(val) => (typeof val === 'number' ? val / 100 : 0)}
          ></OSDigitFieldBase>
        </Space>
      </Space>
    </OSProviderWrapper>
  );
};

import { ConfigProvider } from '@ty/antd';
import React from 'react';
import zhCN from '@ty/antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import type { SizeType } from '@ty/antd/es/config-provider/SizeContext';

moment.locale('en');

const OSConfigProviderWrapper: React.FC<{
  size?: SizeType;
}> = (props) => {
  return (
    <ConfigProvider
      locale={zhCN}
      componentSize={props.size ?? 'middle'}
      autoInsertSpaceInButton={false}
    >
      {props.children}
    </ConfigProvider>
  );
};

export { OSConfigProviderWrapper };

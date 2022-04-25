import { ConfigProvider } from 'antd';
import React from 'react';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import type { SizeType } from 'antd/es/config-provider/SizeContext';

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

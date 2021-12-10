import { ConfigProvider } from '@ty/antd';
import React from 'react';
import zhCN from '@ty/antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('en');

const OSConfigProviderWrapper: React.FC<{}> = (props) => {
  return (
    <ConfigProvider locale={zhCN} componentSize={'small'} autoInsertSpaceInButton={false}>
      {props.children}
    </ConfigProvider>
  );
};

export { OSConfigProviderWrapper };

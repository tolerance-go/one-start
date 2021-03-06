import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Layout from './components/layout';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React from 'react';
import { IRouteComponentProps, useLocation } from 'umi';
import './layout.less';

moment.locale('zh-cn');

/** moment 使用的时区 跟 GTM 相差8小时 重写moment 默认的 toString 方法解决 */
moment.fn.toISOString = function () {
  return this.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
};

export default (props: IRouteComponentProps) => {
  const { children, ...rest } = props;
  return (
    <ConfigProvider locale={zhCN}>
      {['/proto'].includes(rest.location.pathname) ? (
        children
      ) : (
        <Layout {...rest}>{children}</Layout>
      )}
    </ConfigProvider>
  );
};

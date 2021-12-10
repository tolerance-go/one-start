import { ConfigProvider, Affix, Button, Switch, Space, Input } from '@ty/antd';
import zhCN from '@ty/antd/es/locale/zh_CN';
import Form from '@ty/antd/lib/form/Form';
import FormItem from '@ty/antd/lib/form/FormItem';
import Layout from 'dumi-theme-default/src/layout';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { useMemo, useState } from 'react';
import { IRouteComponentProps } from 'umi';

import './layout.less';
moment.locale('zh-cn');

/** moment 使用的时区 跟 GTM 相差8小时 重写moment 默认的 toString 方法解决 */
moment.fn.toISOString = function () {
  return this.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
};

const MockTagCont = '__mock';

const getToken = () => {
  return localStorage.getItem('tongyu_USER_LOCAL_FIELD');
};

export default ({ children, ...props }: IRouteComponentProps) => {
  const mock = !!localStorage.getItem(MockTagCont);
  const [token, setToken] = useState(getToken());

  return (
    <ConfigProvider locale={zhCN}>
      {location.pathname === '/one-proto' ? (
        children
      ) : (
        <>
          <Layout {...props}>{children}</Layout>
          <Affix offsetBottom={10} style={{ position: 'absolute', right: 10 }}>
            <Space direction="vertical">
              <FormItem label="tongyu_USER_LOCAL_FIELD">
                <Input.TextArea
                  style={{ width: 90 }}
                  size="small"
                  value={token}
                  onChange={(event) => {
                    localStorage.setItem('tongyu_USER_LOCAL_FIELD', event.target.value);
                    setToken(event.target.value);
                  }}
                ></Input.TextArea>
              </FormItem>
              <Switch
                checkedChildren="开启 mock"
                unCheckedChildren="关闭 mock"
                defaultChecked={mock}
                onChange={(checked) => {
                  if (checked) {
                    localStorage.setItem(MockTagCont, 'true');
                  } else {
                    localStorage.setItem(MockTagCont, '');
                  }
                }}
              />
            </Space>
          </Affix>
        </>
      )}
    </ConfigProvider>
  );
};

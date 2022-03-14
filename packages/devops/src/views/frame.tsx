import { UserOutlined } from '@ant-design/icons';
import ProLayout, { ProBreadcrumb } from '@ty-one-components/frame';
import { OSTrigger } from '@ty-one-start/one-start';
import { Avatar, Col, Row } from '@ty/antd';
import React, { useState } from 'react';
import { logout, userIsLogined } from '../utils';
import LnlineLogin from './inline-login';
import PageLicenseList from './page-license-list';
import defaultProps from './_defaultProps';
import PageLicenseApprovalList from './page-license-approval-list';
import PageUserManageList from './page-user-manage-list';

export default () => {
  const [pathname, setPathname] = useState('/license');
  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        {...defaultProps}
        location={{
          pathname,
        }}
        title="one-devops"
        logo={'/logo.svg'}
        headerContentRender={() => <ProBreadcrumb />}
        onMenuHeaderClick={(e) => console.log(e)}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '主页',
          },
          ...routers,
        ]}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              setPathname(item.path || '/welcome');
            }}
          >
            {dom}
          </a>
        )}
        rightContentRender={() => (
          <Row gutter={5}>
            {userIsLogined() ? (
              <Col>
                <OSTrigger
                  type="button"
                  settings={{
                    text: '退出登录',
                    type: 'text',
                  }}
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                />
              </Col>
            ) : null}
            <Col>
              <Avatar shape="square" size="small" icon={<UserOutlined />} />
            </Col>
          </Row>
        )}
      >
        {(() => {
          switch (pathname) {
            case '/license':
              return <PageLicenseList />;
            case '/license-approval':
              return <PageLicenseApprovalList />;
            case '/user-manage':
              return <PageUserManageList />;
            default:
              return <PageLicenseList />;
          }
        })()}
      </ProLayout>
      <LnlineLogin />
    </div>
  );
};

// import { getTongyuUserInfo } from '@/helpers';
import {
  CompassOutlined,
  FolderOpenOutlined,
  FundProjectionScreenOutlined,
  InsertRowBelowOutlined,
  NodeIndexOutlined,
  PayCircleOutlined,
  PropertySafetyOutlined,
  ReadOutlined,
  SettingOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import type { MenuDataItem } from '@ty-one-start/frame';
import ProLayout, { DefaultFooter } from '@ty-one-start/frame';
import { useActionsRef } from '@ty-one-start/utils';
// import { UserInfoModel } from './_models/user-info';
import { getMatchMenu, transformRoute } from '@umijs/route-utils';
import { Input } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import type { Location } from 'umi';
import { history, useIntl } from 'umi';
import './content.less';
import { WithExceptionOpChildren } from './exception';
import { RightContent } from './right-content';

// const routes = getRoutes();

const iconMaps = {
  InsertRowBelowOutlined: <InsertRowBelowOutlined />,
  FundProjectionScreenOutlined: <FundProjectionScreenOutlined />,
  NodeIndexOutlined: <NodeIndexOutlined />,
  PayCircleOutlined: <PayCircleOutlined />,
  ReadOutlined: <ReadOutlined />,
  FolderOpenOutlined: <FolderOpenOutlined />,
  SettingOutlined: <SettingOutlined />,
  UserSwitchOutlined: <UserSwitchOutlined />,
  CompassOutlined: <CompassOutlined />,
  PropertySafetyOutlined: <PropertySafetyOutlined />,
};

const Content: React.FC<{
  location: Location;
  route?: { routes?: MenuDataItem[] };
}> = (props) => {
  console.log('🚀 ~ file: content.tsx ~ line 46 ~ props', props);
  const { location, route } = props;
  // const { setUsername } = UserInfoModel.useContainer();
  const [keyWord, setKeyWord] = useState('');
  const { formatMessage } = useIntl();
  const [collapsed, setCollapsed] = useState(false);
  // const isSlaveApp = window[QIANKUN_GLOBAL.IS_SLAVE_APP];
  // const fromBctPage = window[QIANKUN_GLOBAL.FROM_PAGE];

  // const tongyuUserInfo = getTongyuUserInfo();

  // const { permissions } = tongyuUserInfo;

  useEffect(() => {
    // if (isSlaveApp) {
    //   return;
    // }
    // if (store.get(TOKEN_FIELD) == null) {
    //   logout();
    // }
  }, []);

  const loopMenuItem = (menus: MenuDataItem[] = []): MenuDataItem[] => {
    return menus
      .map((item) => {
        // if (permissions?.[item.name ?? '']) {
        if (item.routes) {
          return {
            ...item,
            name: formatMessage({
              id: `menu.${item.name ?? item.menuName ?? 'unknown'}`,
            }),
            routes: loopMenuItem(item.routes),
            icon: typeof item.icon === 'string' ? iconMaps[item.icon] : item.icon,
            hideInMenu: !!(process.env.NODE_ENV === 'production' && item.hideInMenuWhenProduction),
          };
        }
        return {
          ...item,
          name: formatMessage({
            id: `menu.${item.name ?? item.menuName ?? 'unknown'}`,
          }),
          icon: typeof item.icon === 'string' ? iconMaps[item.icon] : item.icon,
          hideInMenu: !!(process.env.NODE_ENV === 'production' && item.hideInMenuWhenProduction),
        };
        // }
        // return null;
      })
      .filter((item) => item.path !== '/') as MenuDataItem[];
  };

  const utilsRef = useActionsRef({
    loopMenuItem,
  });

  const routes = useMemo(() => {
    return utilsRef.current.loopMenuItem(props.route?.routes);
  }, [props.route, utilsRef]);

  console.log('props.route', props.route);

  const filterByMenuDate = (data: MenuDataItem[], keyWord_: string): MenuDataItem[] =>
    data
      .map((item) => {
        if (
          (item.locale &&
            formatMessage({
              id: item.locale,
              defaultMessage: item.name,
            }).includes(keyWord_)) ||
          filterByMenuDate(item.routes || [], keyWord_).length > 0
        ) {
          return {
            ...item,
            routes: filterByMenuDate(item.routes || [], keyWord_),
          };
        }

        return undefined;
      })
      .filter((item) => item) as MenuDataItem[];

  // if (isSlaveApp && fromBctPage) {
  //   return <div>{props.children}</div>;
  // }

  const currentPathConfig = useMemo(() => {
    const { menuData } = transformRoute(routes || [], undefined, undefined, true);
    // 动态路由匹配
    const currentPathConfigMenus = getMatchMenu(location.pathname, menuData).pop();
    return currentPathConfigMenus || {};
  }, [location.pathname, routes]);

  return (
    <div
      className={classNames('swap-admin-layout-wrapper', {
        // isSlaveApp,
      })}
    >
      <ProLayout
        fixSiderbar
        collapsed={collapsed}
        // collapsedButtonRender={(collapsed_) =>
        //   collapsed_ ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
        // }
        menuExtraRender={({ collapsed: collapsed_ }) =>
          !collapsed_ && (
            <Input.Search
              style={{ width: '100%' }}
              onSearch={(e) => {
                setKeyWord(e);
              }}
              allowClear
              placeholder="请输入关键字"
            />
          )
        }
        route={{
          path: '/',
          routes,
        }}
        location={{
          pathname: props.location.pathname,
        }}
        title={'Swap 互换系统'}
        logo={'/logo.svg'}
        // headerContentRender={() => {
        //   return (
        //     <Row justify="start" align="middle">
        //       {/* <div
        //         onClick={() => setCollapsed(!collapsed)}
        //         style={{
        //           cursor: 'pointer',
        //           fontSize: '16px',
        //           display: 'inline-block',
        //           marginRight: '15px',
        //         }}
        //       >
        //         {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        //       </div> */}
        //       <ProBreadcrumb />
        //     </Row>
        //   );
        // }}
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
              history.push(item.path || '/welcome');
            }}
          >
            {dom}
          </a>
        )}
        onCollapse={setCollapsed}
        rightContentRender={() => <RightContent />}
        footerRender={() => (
          <DefaultFooter
            copyright={`Tongyu All Rights Reserved 上海同余信息科技有限公司 沪ICP备16043748号`}
          />
        )}
        postMenuData={(menus) => filterByMenuDate(menus || [], keyWord)}
      >
        <WithExceptionOpChildren currentPathConfig={currentPathConfig}>
          {props.children}
        </WithExceptionOpChildren>
      </ProLayout>
    </div>
  );
};

export default Content;

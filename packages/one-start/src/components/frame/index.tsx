import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import type { MenuProps } from '@ty/antd';
import { Col, Layout, Menu, Row, Skeleton, Space, Tabs } from '@ty/antd';
import cls from 'classnames';
import produce from 'immer';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { OSFrameAPI, OSFrameType, OSNavItem } from '@ty-one-start/typings';
import { normalizeRequestOutputs } from '../utils/normalize-request-outputs';
import { useClsPrefix } from '../utils/use-cls-prefix';
import { useLoading } from '../utils/use-loading';

const { TabPane } = Tabs;

const { Sider } = Layout;

const OSFrame: React.ForwardRefRenderFunction<OSFrameAPI, OSFrameType> = (props, ref) => {
  const { settings, requests } = props;
  const { navData, pageMaps } = settings ?? {};
  const requestNavDataLoading = useLoading();
  const [collapsed, setCollapsed] = useState(false);
  const [navMenuData, setNavMenuData] = useState<OSNavItem[]>();
  const clsPrefix = useClsPrefix('layout');

  const [panes, setPanes] = useState<
    {
      title?: string;
      key?: string;
    }[]
  >([]);
  const [activeKey, setActiveKey] = useState<string>();

  const navDataMapRef = useRef<Record<string, OSNavItem>>({});

  const renderNavMenu = (menu_?: OSNavItem[], parentKeyPath: (string | number)[] = []) => {
    return menu_?.map((item, index) => {
      const key = item.key ?? item.title ?? index;

      navDataMapRef.current[key] = item;

      if (item.children && item.children.length) {
        return (
          <Menu.SubMenu key={key} icon={item.icon} title={item.title}>
            {renderNavMenu(item.children, parentKeyPath?.concat(key ?? []))}
          </Menu.SubMenu>
        );
      }

      return (
        <Menu.Item key={key} icon={item.icon}>
          {item.title}
        </Menu.Item>
      );
    });
  };

  const requestNavData = async () => {
    if (!requests?.requestNavData) return;

    requestNavDataLoading.switch();
    const { error, data } = await requests.requestNavData().then(normalizeRequestOutputs);
    requestNavDataLoading.switch();
    if (error) return;
    setNavMenuData(data);
  };

  const handleMenuClick: MenuProps['onClick'] = useCallback(
    (info) => {
      const targetNavItem = navDataMapRef.current[info.key];
      if (!targetNavItem) return;

      const targetNavItemKey = targetNavItem.key ?? targetNavItem.title;

      if (panes.some((item) => item.key === targetNavItemKey)) {
        setActiveKey(targetNavItemKey);
        return;
      }

      setPanes(
        produce((draft) => {
          draft.push({
            key: targetNavItemKey,
            title: targetNavItem.title,
          });
        }),
      );
      setActiveKey(targetNavItemKey);
    },
    [panes],
  );

  useEffect(() => {
    requestNavData();
  }, []);

  useImperativeHandle(ref, () => ({}));

  const collapsedWidth = 34;

  const collapseTrigger = React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
    className: `${clsPrefix}-collapsed-trigger`,
    style: {
      padding: 10,
    },
    onClick: () => {
      setCollapsed((prev) => !prev);
    },
  });

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw', background: '#001529' }}>
      <Sider
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
        width={200}
        collapsedWidth={collapsedWidth}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Row style={{ flexDirection: 'column', height: '100%' }} wrap={false}>
          <Col
            flex={'34px'}
            style={{
              background: '#002140',
            }}
          ></Col>
          <Col flex="auto">
            <div
              style={{
                height: `100%`,
                overflow: 'scroll',
              }}
            >
              {requestNavDataLoading.loading ? (
                <Space size={22} direction="vertical" style={{ padding: 16 }}>
                  {Array(8)
                    .fill(null)
                    .map((_, index) => (
                      <Space key={index}>
                        {collapsed ? null : <Skeleton.Avatar active size="small" />}
                        <Skeleton.Button
                          style={{ width: collapsed ? 50 : 135 }}
                          active
                          size="small"
                          shape={'square'}
                        />
                      </Space>
                    ))}
                </Space>
              ) : (
                <Menu theme="dark" mode="inline" onClick={handleMenuClick}>
                  {renderNavMenu(navData ?? navMenuData)}
                </Menu>
              )}
            </div>
          </Col>
          <Col
            flex={'64px'}
            style={{
              background: '#002140',
            }}
          ></Col>
        </Row>
      </Sider>
      <div
        className={cls(`${clsPrefix}-content`, {
          collapsed,
        })}
        style={{ background: '#fff', width: '100%', marginLeft: collapsed ? collapsedWidth : 200 }}
      >
        <div
          className={cls(`${clsPrefix}-tabs-wrapper`, {
            collapsed,
          })}
          style={{
            overflow: 'auto',
            position: 'fixed',
            top: 0,
            left: collapsed ? collapsedWidth : 200,
            height: 34,
            right: 0,
          }}
        >
          {panes.length ? (
            <Tabs
              tabBarExtraContent={{
                left: collapseTrigger,
              }}
              type="editable-card"
              hideAdd
              onChange={setActiveKey}
              activeKey={activeKey}
              onEdit={(info, action) => {
                if (action === 'remove') {
                  setPanes(
                    produce((draft) => {
                      const index = draft.findIndex((item) => item.key === info);
                      const [removed] = draft.splice(index, 1);

                      if (activeKey === removed.key) {
                        const next = (draft[index] ?? draft[index - 1])?.key;
                        setActiveKey(next);
                      }
                    }),
                  );
                }
              }}
            >
              {panes.map((pane) => (
                <TabPane tab={pane.title} key={pane.key ?? pane.title} closable></TabPane>
              ))}
            </Tabs>
          ) : (
            collapseTrigger
          )}
        </div>
        <div
          style={{
            height: `calc(100% - ${collapsedWidth}px)`,
            overflow: 'scroll',
            marginTop: collapsedWidth,
          }}
        >
          <Tabs className={`${clsPrefix}-content-tabs`} activeKey={activeKey}>
            {panes.map((pane) => {
              const key = pane.key ?? pane.title;
              return <TabPane key={key}>{pageMaps?.[key ?? '']}</TabPane>;
            })}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default React.forwardRef(OSFrame);

export const Settings: React.FC<OSFrameType['settings']> = () => <></>;
export const Requests: React.FC<OSFrameType['requests']> = () => <></>;

import { Breadcrumb, Col, Row, Space, Tabs } from 'antd';
import qs from 'qs';
import React, { useImperativeHandle, useMemo, useState } from 'react';
import type { OSPageAPI, OSPageType, RecordType } from '@ty-one-start/typings';
import type { RequiredRecursion } from '@ty-one-start/typings';
import { unstateHistory } from '@ty-one-start/utils';
import { useClsPrefix } from '@ty-one-start/utils';

const getTagKey = (
  tabItem: RequiredRecursion<OSPageType>['settings']['tabs'][number],
  defaultKey?: string | number,
) => {
  return tabItem.key ?? tabItem.title ?? defaultKey?.toString();
};

const OSPage: React.ForwardRefRenderFunction<OSPageAPI, OSPageType> = (props, ref) => {
  const prefixCls = useClsPrefix('page');
  const { settings } = props;
  const { tabs, breadcrumb, title, content, actions, size } = settings ?? {};
  const [activeKey, setActiveKey] = useState(() => {
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    if (typeof query.tabKey === 'string') {
      return query.tabKey;
    }

    const firstDefualtActive = tabs?.find((item) => item.defaultActive);
    if (firstDefualtActive) {
      return getTagKey(firstDefualtActive);
    }
    if (tabs?.[0]) {
      return getTagKey(tabs[0]);
    }
    return undefined;
  });

  const pageActionsDom = useMemo(() => {
    if (!actions) return null;
    return <Space>{actions?.map((item) => item)}</Space>;
  }, [actions]);

  const activeTabItem = useMemo(() => {
    return tabs?.find((item, index) => getTagKey(item, index) === activeKey);
  }, [tabs, activeKey]);

  const tabsActionsDom = useMemo(() => {
    const actions_ = activeTabItem?.actions;
    if (actions_ && actions_.length) {
      return <Space>{actions_?.map((item) => item)}</Space>;
    }
    return null;
  }, [activeTabItem]);

  const contentDom = useMemo(() => {
    if (React.isValidElement(content)) {
      return content;
    }
    return activeKey && content?.[activeKey]
      ? React.cloneElement(content?.[activeKey], {
          key: activeKey,
          __localkey: activeKey,
        })
      : null;
  }, [content, activeKey]);

  const openTab = ({ tabKey, query }: { tabKey: string; query?: RecordType }) => {
    setActiveKey(tabKey);

    unstateHistory.push({
      pathname: window.location.pathname,
      query: {
        ...query,
        tabKey,
      },
    });
  };

  useImperativeHandle(ref, () => ({
    openTab,
  }));

  return (
    <div className={prefixCls}>
      <Row justify="space-between" className={`${prefixCls}-header`}>
        <Col>
          <Breadcrumb>
            {breadcrumb?.map((item, index) => {
              return <Breadcrumb.Item key={item.name ?? index}>{item.name}</Breadcrumb.Item>;
            })}
            {title ? <Breadcrumb.Item key={title}>{title}</Breadcrumb.Item> : null}
          </Breadcrumb>
        </Col>
        <Col>{pageActionsDom}</Col>
      </Row>
      {tabs ? (
        <Tabs
          type="line"
          size={size ?? 'large'}
          className={`${prefixCls}-tabs`}
          activeKey={activeKey}
          onChange={(_type) => {
            setActiveKey(_type);

            unstateHistory.push({
              pathname: window.location.pathname,
              query: {
                tabKey: _type,
              },
            });
          }}
          tabBarExtraContent={tabsActionsDom}
        >
          {tabs.map((item, index) => {
            return <Tabs.TabPane tab={item.title} key={getTagKey(item, index)}></Tabs.TabPane>;
          })}
        </Tabs>
      ) : null}
      {contentDom}
    </div>
  );
};

export default React.forwardRef(OSPage);

export const Settings: React.FC<OSPageType['settings']> = () => <></>;

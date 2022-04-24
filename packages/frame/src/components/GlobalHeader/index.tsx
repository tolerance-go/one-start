import classNames from 'classnames';
import React from 'react';
import { clearMenuItem } from '../../utils/utils';
import type { GlobalHeaderProps, PrivateSiderMenuProps, SiderMenuProps } from '../../typings';
import {
  defaultRenderCollapsedButton,
  defaultRenderLogo,
  defaultRenderLogoAndTitle,
} from '../SiderMenu/SiderMenu';
import TopNavHeader from '../TopNavHeader';
import './index.less';

const renderLogo = (
  menuHeaderRender: SiderMenuProps['menuHeaderRender'],
  logoDom: React.ReactNode,
) => {
  if (menuHeaderRender === false) {
    return null;
  }
  if (menuHeaderRender) {
    return menuHeaderRender(logoDom, null);
  }
  return logoDom;
};

const GlobalHeader: React.FC<GlobalHeaderProps & PrivateSiderMenuProps> = (props) => {
  const {
    isMobile,
    logo,
    collapsed,
    onCollapse,
    collapsedButtonRender = defaultRenderCollapsedButton,
    rightContentRender,
    menuHeaderRender,
    onMenuHeaderClick,
    className: propClassName,
    style,
    layout,
    children,
    headerTheme = 'dark',
    splitMenus,
    menuData,
    prefixCls,
  } = props;
  const baseClassName = `${prefixCls}-global-header`;
  const className = classNames(propClassName, baseClassName, {
    [`${baseClassName}-layout-${layout}`]: layout && headerTheme === 'dark',
  });

  if (layout === 'mix' && !isMobile && splitMenus) {
    const noChildrenMenuData = (menuData || []).map((item) => ({
      ...item,
      children: undefined,
      routes: undefined,
    }));
    const clearMenuData = clearMenuItem(noChildrenMenuData);
    return (
      <TopNavHeader
        mode="horizontal"
        {...props}
        splitMenus={false}
        menuData={clearMenuData}
        theme={headerTheme as 'light' | 'dark'}
      />
    );
  }

  const logoDom = (
    <span className={`${baseClassName}-logo`} key="logo">
      <a>{defaultRenderLogo(logo)}</a>
    </span>
  );

  return (
    <div className={className} style={{ ...style }}>
      {isMobile && renderLogo(menuHeaderRender, logoDom)}
      {isMobile && collapsedButtonRender && (
        <span
          className={`${baseClassName}-collapsed-button`}
          onClick={() => {
            if (onCollapse) {
              onCollapse(!collapsed);
            }
          }}
        >
          {collapsedButtonRender(collapsed)}
        </span>
      )}
      {layout === 'mix' && !isMobile && (
        <>
          <div className={`${baseClassName}-logo`} onClick={onMenuHeaderClick}>
            {defaultRenderLogoAndTitle({ ...props, collapsed: false }, 'headerTitleRender')}
          </div>
        </>
      )}
      <div style={{ flex: 1 }}>{children}</div>
      {rightContentRender && rightContentRender(props)}
    </div>
  );
};

export default GlobalHeader;

import type { BasicLayoutProps } from './typings';
import BasicLayout from './BasicLayout';
import type { HeaderViewProps as HeaderProps } from './typings';
import DefaultHeader from './Header';
import type { TopNavHeaderProps } from './components/TopNavHeader';
import TopNavHeader from './components/TopNavHeader';
import SettingDrawer from './components/SettingDrawer';

import type { FooterProps } from './Footer';
import DefaultFooter from './Footer';
import GridContent from './components/GridContent';
import type { PageContainerProps, RouteContextType } from './typings';
import RouteContext from './RouteContext';
import getMenuData from './utils/getMenuData';
import getPageTitle from './getPageTitle';
import PageLoading from './components/PageLoading';
import FooterToolbar from './components/FooterToolbar';
import WaterMark from './components/WaterMark';
import PageContainer, { ProPageHeader, ProBreadcrumb } from './components/PageContainer';
import type { ProSettings } from './typings';

export type { MenuDataItem } from './typings';

const PageHeaderWrapper = PageContainer;

export {
  BasicLayout,
  RouteContext,
  PageLoading,
  GridContent,
  DefaultHeader,
  TopNavHeader,
  DefaultFooter,
  SettingDrawer,
  getPageTitle,
  PageHeaderWrapper,
  getMenuData,
  PageContainer,
  FooterToolbar,
  WaterMark,
  ProPageHeader,
  ProBreadcrumb,
};

export type {
  FooterProps,
  PageContainerProps,
  TopNavHeaderProps,
  BasicLayoutProps,
  RouteContextType,
  HeaderProps,
  ProSettings,
};

export default BasicLayout;

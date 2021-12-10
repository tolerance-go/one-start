import type { OSCore, RequestIO } from './core';

export type OSNavItem = {
  title?: string;
  icon?: React.ReactNode;
  children?: OSNavItem[];
  key?: string;
};

export interface OSLayoutAPI {}

export interface OSLayoutType extends OSCore {
  settings?: {
    /** 导航菜单配置 */
    navData?: OSNavItem[];
    /** 页面和导航映射 */
    pageMaps?: Record<string, React.ReactElement>;
  };
  requests?: {
    /** 请求导航栏数据 */
    requestNavData: RequestIO<void, OSNavItem[]>;
  };
}

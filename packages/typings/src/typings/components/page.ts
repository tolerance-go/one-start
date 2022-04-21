import type { OSCore } from './core';
import type { RecordType } from '../core';
import { SizeType } from '@ty/antd/es/config-provider/SizeContext';

export interface OSPageAPI {
  /** 打开指定 tab 页面 */
  openTab: (options: { tabKey: string; query?: RecordType }) => void;
}

export interface OSPageType extends OSCore {
  settings?: {
    /** 当前页面的标题 */
    title?: string;
    /** 面包屑导航 */
    breadcrumb?: {
      path?: string;
      name?: string;
    }[];
    /** tabs 定义 */
    tabs?: {
      title?: string;
      key?: string;
      defaultActive?: boolean;
      actions?: React.ReactNode[];
    }[];
    /** 页面内容 */
    content?: React.ReactElement | Record<string, React.ReactElement>;
    /** 页面操作 */
    actions?: React.ReactNode[];
    size?: SizeType;
  };
}

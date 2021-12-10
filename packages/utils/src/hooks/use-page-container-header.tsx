import type { BreadcrumbProps } from '@ty/antd';
import { useMemo } from 'react';

interface UsePageContainerHeaderProps {
  /**
   * @description 设置当前页面 path
   */
  path?: string;
  /**
   * @description 父级面包屑配置
   */
  parentRoutes?: BreadcrumbProps['routes'];
  /**
   * @description 设置当前页面默认 path
   */
  defaultPath?: string;
  /**
   * @description 默认页面默认标题
   */
  defaultTitle?: string;
  /**
   * @description 默认页面面包屑标题
   */
  defaultBreadcrumbName?: string;
}

const usePageContainerHeader = (props: UsePageContainerHeaderProps) => {
  const finalHeader = useMemo(() => {
    return {
      title: props.defaultTitle ?? '',
      breadcrumb: {
        routes: [
          ...(props.parentRoutes ?? []),
          {
            path: props.path ?? props.defaultPath ?? '',
            breadcrumbName: props.defaultBreadcrumbName ?? props.defaultTitle ?? '',
          },
        ],
      },
    };
  }, [props.parentRoutes, props.path]);

  return {
    header: finalHeader,
  };
};

export { usePageContainerHeader };
export type { UsePageContainerHeaderProps };

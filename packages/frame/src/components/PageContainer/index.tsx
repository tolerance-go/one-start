import type { BreadcrumbProps, PageHeaderProps, SpinProps } from '@ty/antd';
import { Affix, Breadcrumb, ConfigProvider, PageHeader, Tabs } from '@ty/antd';
import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import RouteContext from '../../RouteContext';
import type { PageContainerProps } from '@ty-one-start/typings';
import FooterToolbar from '../FooterToolbar';
import GridContent from '../GridContent';
import PageLoading from '../PageLoading';
import WaterMark from '../WaterMark';
import './index.less';

function genLoading(spinProps: boolean | SpinProps) {
  if (typeof spinProps === 'object') {
    return spinProps;
  }
  return { spinning: spinProps };
}

/**
 * Render Footer tabList In order to be compatible with the old version of the PageHeader basically
 * all the functions are implemented.
 */
const renderFooter: React.FC<
  Omit<
    PageContainerProps & {
      prefixedClassName: string;
    },
    'title'
  >
> = ({ tabList, tabActiveKey, onTabChange, tabBarExtraContent, tabProps, prefixedClassName }) => {
  if (Array.isArray(tabList) || tabBarExtraContent) {
    return (
      <Tabs
        className={`${prefixedClassName}-tabs`}
        activeKey={tabActiveKey}
        onChange={(key) => {
          if (onTabChange) {
            onTabChange(key);
          }
        }}
        tabBarExtraContent={tabBarExtraContent}
        {...tabProps}
      >
        {tabList?.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tabs.TabPane {...item} tab={item.tab} key={item.key || index} />
        ))}
      </Tabs>
    );
  }
  return null;
};

const renderPageHeader = (
  content: React.ReactNode,
  extraContent: React.ReactNode,
  prefixedClassName: string,
): React.ReactNode => {
  if (!content && !extraContent) {
    return null;
  }
  return (
    <div className={`${prefixedClassName}-detail`}>
      <div className={`${prefixedClassName}-main`}>
        <div className={`${prefixedClassName}-row`}>
          {content && <div className={`${prefixedClassName}-content`}>{content}</div>}
          {extraContent && (
            <div className={`${prefixedClassName}-extraContent`}>{extraContent}</div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 配置与面包屑相同，只是增加了自动根据路由计算面包屑的功能。此功能必须要在 ProLayout 中使用。
 *
 * @param props
 * @returns
 */
const ProBreadcrumb: React.FC<BreadcrumbProps> = (props) => {
  const value = useContext(RouteContext);
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Breadcrumb {...value?.breadcrumb} {...value?.breadcrumbProps} {...props} />
    </div>
  );
};

const ProPageHeader: React.FC<PageContainerProps & { prefixedClassName: string }> = (props) => {
  const value = useContext(RouteContext);
  const {
    title,
    content,
    pageHeaderRender,
    header,
    prefixedClassName,
    extraContent,
    style,
    prefixCls,
    breadcrumbRender,
    ...restProps
  } = props;

  const getBreadcrumbRender = useMemo(() => {
    if (!breadcrumbRender) {
      return undefined;
    }
    return breadcrumbRender;
  }, [breadcrumbRender]);

  if (pageHeaderRender === false) {
    return null;
  }
  if (pageHeaderRender) {
    return <> {pageHeaderRender({ ...props, ...value })}</>;
  }
  let pageHeaderTitle = title;
  if (!title && title !== false) {
    pageHeaderTitle = value.title;
  }
  const pageHeaderProps: PageHeaderProps = {
    ...value,
    title: pageHeaderTitle,
    ...restProps,
    footer: renderFooter({
      ...restProps,
      breadcrumbRender,
      prefixedClassName,
    }),
    ...header,
  };

  const { breadcrumb } = pageHeaderProps as {
    breadcrumb: BreadcrumbProps;
  };
  const noHasBreadCrumb =
    (!breadcrumb || (!breadcrumb?.itemRender && !breadcrumb?.routes?.length)) && !breadcrumbRender;

  if (
    ['title', 'subTitle', 'extra', 'tags', 'footer', 'avatar', 'backIcon'].every(
      (item) => !pageHeaderProps[item],
    ) &&
    noHasBreadCrumb &&
    !content &&
    !extraContent
  ) {
    return null;
  }

  return (
    <div className={`${prefixedClassName}-warp`}>
      <PageHeader
        {...pageHeaderProps}
        breadcrumb={
          breadcrumbRender === false
            ? undefined
            : { ...pageHeaderProps.breadcrumb, ...value.breadcrumbProps }
        }
        breadcrumbRender={getBreadcrumbRender}
        prefixCls={prefixCls}
      >
        {header?.children || renderPageHeader(content, extraContent, prefixedClassName)}
      </PageHeader>
    </div>
  );
};

const PageContainer: React.FC<PageContainerProps> = (props) => {
  const {
    children,
    loading = false,
    className,
    style,
    footer,
    affixProps,
    ghost,
    fixedHeader,
    breadcrumbRender,
    ...restProps
  } = props;
  const value = useContext(RouteContext);

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = props.prefixCls || getPrefixCls('pro');

  const prefixedClassName = `${prefixCls}-page-container`;

  const containerClassName = classNames(prefixedClassName, className, {
    [`${prefixCls}-page-container-ghost`]: ghost,
    [`${prefixCls}-page-container-with-footer`]: footer,
  });

  const content = useMemo(() => {
    return children ? (
      <>
        <div className={`${prefixedClassName}-children-content`}>{children}</div>
        {value.hasFooterToolbar && (
          <div
            style={{
              height: 48,
              marginTop: 24,
            }}
          />
        )}
      </>
    ) : null;
  }, [children, prefixedClassName, value.hasFooterToolbar]);

  const memoBreadcrumbRender = useMemo(() => {
    // eslint-disable-next-line eqeqeq
    if (breadcrumbRender == false) return false;
    return breadcrumbRender || restProps?.header?.breadcrumbRender;
  }, [breadcrumbRender, restProps?.header?.breadcrumbRender]);
  const pageHeaderDom = (
    <ProPageHeader
      {...restProps}
      breadcrumbRender={memoBreadcrumbRender}
      ghost={ghost}
      prefixCls={undefined}
      prefixedClassName={prefixedClassName}
    />
  );
  const loadingDom = useMemo(() => {
    // 当loading时一个合法的ReactNode时，说明用户使用了自定义loading,直接返回改自定义loading
    if (React.isValidElement(loading)) {
      return loading;
    }
    // 当传递过来的是布尔值，并且为false时，说明不需要显示loading,返回null
    if (typeof loading === 'boolean' && !loading) {
      return null;
    }
    // 如非上述两种情况，那么要么用户传了一个true,要么用户传了loading配置，使用genLoading生成loading配置后返回PageLoading
    const spinProps = genLoading(loading as boolean | SpinProps);
    return <PageLoading {...spinProps} />;
  }, [loading]);

  const renderContentDom = useMemo(() => {
    // 只要loadingDom非空我们就渲染loadingDom,否则渲染内容
    const dom = loadingDom || content;
    if (props.waterMarkProps || value.waterMarkProps) {
      return <WaterMark {...(props.waterMarkProps || value.waterMarkProps)}>{dom}</WaterMark>;
    }
    return dom;
  }, [props.waterMarkProps, value.waterMarkProps, loadingDom, content]);

  return (
    <div style={style} className={containerClassName}>
      {fixedHeader && pageHeaderDom ? (
        // 在 hasHeader 且 fixedHeader 的情况下，才需要设置高度
        <Affix
          offsetTop={value.hasHeader && value.fixedHeader ? value.headerHeight : 0}
          {...affixProps}
        >
          {pageHeaderDom}
        </Affix>
      ) : (
        pageHeaderDom
      )}
      {renderContentDom && <GridContent>{renderContentDom}</GridContent>}
      {footer && <FooterToolbar prefixCls={prefixCls}>{footer}</FooterToolbar>}
    </div>
  );
};

export { ProPageHeader, ProBreadcrumb };

export default PageContainer;

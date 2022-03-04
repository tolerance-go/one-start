---
nav:
  title: components
  order: 1
  path: /components
title: os-frame(pro)
group:
  title: general
  path: /components/general
---

# frame - 高级布局

frame 可以提供一个标准又不失灵活的中后台标准布局，同时提供一键切换布局形态，自动生成菜单等功能。与 PageContainer 配合使用可以自动生成面包屑，页面标题，并且提供低成本方案接入页脚工具栏。

## 何时使用

页面中需要承载内容时，可以使用 frame 来减少布局成本。

## 代码演示

### 基础使用

<code src="./demos/base.tsx" iframe="650px" title="基础使用"/>

### 从服务器加载 menu

frame 提供了强大的菜单功能，但是这样必然会封装很多行为，导致需要一些特殊逻辑的用户感到不满。所以我们提供了很多的 API，期望可以满足绝大部分客户的方式。

从服务器加载 menu 主要使用的 API 是 `menuDataRender` 和 `menuRender`,`menuDataRender`可以控制当前的菜单数据，`menuRender`可以控制菜单的 dom 节点。

<code src="./demos/dynamicMenu.tsx" iframe="500px" title="从服务器加载 menu"/>

### 从服务器加载 menu 并且使用 icon

这里主要是一个演示，我们需要准备一个枚举来进行 icon 的渲染，可以显著的减少打包的大小

<code src="./demos/antd@4MenuIconFormServe.tsx" iframe="500px" title="从服务器加载 menu 并且使用 icon"/>

### 自定义 menu 的内容

通过 `menuItemRender`, `subMenuItemRender`,`title`,`logo`,`menuHeaderRender` 可以非常方便的自定义 menu 的样式。如果实在是不满意，可以使用 `menuRender` 完全的自定义。

<code src="./demos/customizeMenu.tsx" iframe="500px" title="自定义 menu 的内容"/>

### 自定义页脚

frame 默认不提供页脚，要是和 Pro 官网相同的样式，需要自己引入一下页脚。

<code src="./demos/footer.tsx" iframe="500px" title="自定义页脚"/>

这里用于展示 frame 的各种应用，如果你觉得你的用法能帮助到别人，欢迎 PR。

### 搜索菜单

<code src="./demos/searchMenu.tsx" iframe="500px" title="搜索菜单" />

### 多个路由对应一个菜单项

<code src="./demos/MultipleMenuOnePath.tsx" iframe="500px" title="多个路由对应一个菜单项" />

### 默认打开所有菜单

menu 配置 `defaultOpenAll` 可以默认打开所有菜单

<code src="./demos/DefaultOpenAllMenu.tsx" iframe="500px" title="默认打开所有菜单" />

折叠按钮反复切换后`defaultOpenAll`将失效，menu 配置 `ignoreFlatMenu` 可以忽略手动折叠过的菜单，实现总是默认打开所有菜单

<code src="./demos/AlwaysDefaultOpenAllMenu.tsx" iframe="500px" title="总是默认打开所有菜单" />

### 使用 IconFont

<code src="./demos/IconFont.tsx" iframe="500px" title="使用 IconFont" />

### ghost 模式

PageContainer 配置 `ghost` 可以将页头切换为透明模式。

<code src="./demos/ghost.tsx" iframe="500px" title="ghost 模式" />

### 嵌套布局

<code src="./demos/Nested.tsx" iframe="500px" title="嵌套布局" />

### 自定义的 collapsed

<code src="./demos/customize-collapsed.tsx" iframe="500px" title="自定义的 collapsed" />

### 面包屑显示在顶部

<code src="./demos/top-breadcrumb.tsx" iframe="500px" title="面包屑显示在顶部" />

### 多级站点导航

<code src="./demos/immersive-navigation.tsx" iframe="500px" title="多级站点导航" />

### 沉浸式导航

<code src="./demos/immersive-navigation-top.tsx" iframe="500px" title="沉浸式导航" />

### layout 自带了错误处理功能，防止白屏

<code src="./demos/error-boundaries.tsx" iframe="500px" title="沉浸式导航" />

<code src="./demos/splitMenus.tsx" iframe="500px" title="沉浸式导航" debug />

## API

### frame

> 所有以 `Render` 后缀的方法都可以通过传入 `false` 来使其不渲染。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | layout 的左上角 的 title | `ReactNode` | `'Ant Design Pro'` |
| logo | layout 的左上角 logo 的 url | `ReactNode` \| `()=> ReactNode` | - |
| pure | 是否删除掉所有的自带界面 | `boolean` | - |
| loading | layout 的加载态 | `boolean` | - |
| location | 当前应用会话的位置信息。如果你的应用创建了自定义的 history，则需要显示指定 location 属性，详见 [issue](https://github.com/ant-design/pro-components/issues/327) | [history.location](https://reactrouter.com/web/api/history) | isBrowser ? window.location : undefined |
| menuHeaderRender | 渲染 logo 和 title | `ReactNode` \| `(logo,title)=>ReactNode` | - |
| menuFooterRender | 在 layout 底部渲染一个块 | `(menuProps)=>ReactNode` | - |
| onMenuHeaderClick | menu 菜单的头部点击事件 | `(e: React.MouseEvent<HTMLDivElement>) => void` | - |
| menuExtraRender | 在菜单标题的下面渲染一个区域 | `(menuProps)=>ReactNode` | - |
| onTopMixMenuHeaderClick | mix 模式下顶部栏的头部点击事件 | `(e: React.MouseEvent<HTMLDivElement>) => void` | - |
| contentStyle | layout 的内容区 style | CSSProperties | - |
| layout | layout 的菜单模式,side：右侧导航，top：顶部导航 | `side` \| `top`\|`mix` | `side` |
| contentWidth | layout 的内容模式,Fluid：自适应，Fixed：定宽 1200px | `Fluid` \| `Fixed` | `Fluid` |
| navTheme | 导航的主题，side 和 mix 模式下是左侧菜单的主题，top 模式下是顶部菜单 | `light` \| `dark` | `dark` |
| actionRef | layout 的常见的操作，比如刷新菜单 | `MutableRefObject<ActionType>` | - |
| headerTheme | 顶部导航的主题，mix 模式生效 | `light` \| `dark` | `dark` |
| fixedHeader | 是否固定 header 到顶部 | `boolean` | `false` |
| fixSiderbar | 是否固定导航 | `boolean` | `false` |
| breakpoint | 触发响应式布局的[断点](https://ant.design/components/grid-cn/#Col) | `Enum { 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' }` | `lg` |
| menu | 关于 [menu](#menu) 的配置，暂时只有 locale,locale 可以关闭 menu 的自带的全球化 | [`menuConfig`](#menu) | `{ locale: true }` |
| iconfontUrl | 使用 [IconFont](https://ant.design/components/icon-cn/#components-icon-demo-iconfont) 的图标配置 | `URL` | - |
| locale | 当前 layout 的语言设置 | `zh-CN` \| `zh-TW` \| `en-US` | navigator.language |
| settings | layout 的设置 | [`Settings`](#Settings) | - |
| siderWidth | 侧边菜单宽度 | `number` | 208 |
| defaultCollapsed | 默认的菜单的收起和展开，会受到 `breakpoint` 的影响，`breakpoint=false` 生效 | `boolean` | - |
| collapsed | 控制菜单的收起和展开 | `boolean` | - |
| onCollapse | 菜单的折叠收起事件 | `(collapsed: boolean) => void` | - |
| onPageChange | 页面切换时触发 | `(location: Location) => void` | - |
| headerRender | 自定义头的 render 方法 | `(props: BasicLayoutProps) => ReactNode` | - |
| headerTitleRender | 自定义头标题的方法,mix 模式下生效 | `(logo,title,props)=>ReactNode` | - |
| headerContentRender | 自定义头内容的方法 | `(props: BasicLayoutProps) => ReactNode` | - |
| rightContentRender | 自定义头右部的 render 方法 | `(props: HeaderViewProps) => ReactNode` | - |
| collapsedButtonRender | 自定义 collapsed button 的方法 | `(collapsed: boolean) => ReactNode` | - |
| footerRender | 自定义页脚的 render 方法 | `(props: BasicLayoutProps) => JSX.Element \| false` | - |
| pageTitleRender | 自定义页面标题的显示方法 | `(props: BasicLayoutProps) => string` | - |
| menuRender | 自定义菜单的 render 方法 | `(props: HeaderViewProps) => ReactNode` | - |
| postMenuData | 在显示前对菜单数据进行查看，修改不会触发重新渲染 | `(menuData: MenuDataItem[]) => MenuDataItem[]` | - |
| menuItemRender | 自定义菜单项的 render 方法 | [`(itemProps: MenuDataItem, defaultDom: React.ReactNode, props: BaseMenuProps) => ReactNode`](/components/layout/#menudataitem) | - |
| subMenuItemRender | 自定义拥有子菜单菜单项的 render 方法 | [`(itemProps: MenuDataItem) => ReactNode`](/components/layout/#menudataitem) | - |
| menuDataRender | menuData 的 render 方法，用来自定义 menuData | `(menuData: MenuDataItem[]) => MenuDataItem[]` | - |
| breadcrumbRender | 自定义面包屑的数据 | `(route)=>route` | - |
| breadcrumbProps | 传递到 antd Breadcrumb 组件的 props, 参考 (https://ant.design/components/breadcrumb-cn/) | `breadcrumbProps` | undefined |
| route | 用于生成菜单和面包屑。umi 的 Layout 会自动带有 | [route](#route) | - |
| disableMobile | 禁止自动切换到移动页面 | `boolean` | false |
| ErrorBoundary | 自带了错误处理功能，防止白屏，`ErrorBoundary=false` 关闭默认错误边界 | `ReactNode` | 内置 ErrorBoundary |
| links | 显示在菜单右下角的快捷操作 | `ReactNode[]` | - |
| menuProps | 传递到 antd menu 组件的 props, 参考 (https://ant.design/components/menu-cn/) | `MenuProps` | undefined |
| waterMarkProps | 配置水印，水印是 PageContainer 的功能，layout 只是透传给 PageContainer | [WaterMarkProps](/components/water-mark) | - |

### menu

menu 中支持了部分常用的 menu 配置， 可以帮助我们更好的管理 menu

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| locale | menu 是否使用国际化，还需要 formatMessage 的配合。 | `boolean` | `true` |
| defaultOpenAll | 默认打开所有的菜单项，要注意只有 layout 挂载之前生效，异步加载菜单是不支持的 | `boolean` | `false` |
| ignoreFlatMenu | 是否忽略手动折叠过的菜单状态，结合 defaultOpenAll 可实现折叠按钮切换后，同样可以展开所有子菜单 | `boolean` | `false` |
| type | 菜单的类型 | `sub` \| `group` | `group` |
| autoClose | 选中菜单是否自动关闭菜单 | `boolean` | `true` |
| loading | 菜单是否正在加载中 | `boolean` | `false` |
| onLoadingChange | 菜单的加载状态变更 | `(loading)=>void` | - |
| request | 远程加载菜单的方法，会自动的修改 loading 状态 | `(params,defaultMenuDat) => Promise<MenuDataItem[]>` | - |

### SettingDrawer

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| settings | layout 的设置 | [`Settings`](#Settings) \| [`Settings`](#Settings) | - |
| onSettingChange | [`Settings`](#Settings) 发生更改事件 | `(settings: [`Settings`](#Settings) ) => void` | - |
| hideHintAlert | 删除下方的提示信息 | `boolean` | - |
| hideCopyButton | 不展示 copy 功能 | `boolean` | - |
| disableUrlParams | 禁止同步设置到查询参数 | `boolean` | `false` |
| enableDarkTheme | 打开黑色主题切换功能 ｜ `boolean` | `false` |
| colorList | 自带的颜色切换系统 ｜ `{key,color}[]` | `ColorList` |

自带的颜色列表

```tsx | pure
const colorList = [
  { key: 'daybreak', color: '#1890ff' },
  { key: 'dust', color: '#F5222D' },
  { key: 'volcano', color: '#FA541C' },
  { key: 'sunset', color: '#FAAD14' },
  { key: 'cyan', color: '#13C2C2' },
  { key: 'green', color: '#52C41A' },
  { key: 'geekblue', color: '#2F54EB' },
  { key: 'purple', color: '#722ED1' },
];
```

### PageLoading

一个简单的加载页面

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| [(...)](https://ant.design/components/spin-cn/#API) | 支持所有的 antd `Spin` 组件参数 | - | - |

### RouteContext

RouteContext 可以提供 Layout 的内置的数据。例如 isMobile 和 collapsed，你可以消费这些数据来自定义一些行为。

```tsx | pure
import { RouteContext, RouteContextType } from '@ty-one-components/frame';

const Page = () => (
  <RouteContext.Consumer>
    {(value: RouteContextType) => {
      return value.title;
    }}
  </RouteContext.Consumer>
);
```

### GridContent

GridContent 封装了 [等宽](https://preview.pro.ant.design/dashboard/analysis?layout=top&contentWidth=Fixed)和 [流式](https://preview.pro.ant.design/dashboard/analysis?layout=top) 的逻辑。你可以在 [preview](https://preview.pro.ant.design/dashboard/analysis) 中查看预览效果。

| 参数         | 说明     | 类型               | 默认值 |
| ------------ | -------- | ------------------ | ------ |
| contentWidth | 内容模式 | `Fluid` \| `Fixed` | -      |

### getMenuData

根据 router 信息来生成 menuData 和 breadcrumb。

```js | pure
import { getMenuData } from '@ty-one-components/frame';

const { breadcrumb, menuData } = getMenuData(routes, menu, formatMessage, menuDataRender);
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| routes | 路由的配置信息 | [route[]](#route) | - |
| menu | menu 的配置项，默认 `{locale: true}` | `{ locale: boolean }` | - |
| menuDataRender | menuData 的 render 方法，用来自定义 menuData | `(menuData: MenuDataItem[]) => MenuDataItem[]` | - |
| formatMessage | react-intl 的 formatMessage 方法 | `(data: { id: any; defaultMessage?: string }) => string;` | - |

### getPageTitle

getPageTitle 封装了根据 menuData 上生成的 title 的逻辑。

```js | pure
import { getPageTitle } from '@ty-one-components/frame';

const title = getPageTitle({
  pathname,
  breadcrumb,
  menu,
  title,
  formatMessage,
});
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| pathname | 当前的 pathname | location.pathname | - |
| breadcrumb | MenuDataItem 的合集 | `{ [path: string]: MenuDataItem }` | - |
| menu | menu 的配置项，默认 `{locale: true}` | `{ locale: boolean }` | - |
| title | title 的类型 | string | 'Ant Design Pro' |
| formatMessage | react-intl 的 formatMessage 方法 | `(data: { id: any; defaultMessage?: string }) => string;` | - |

### Settings

```ts | pure
// 可以通过 import { Settings } from '@ty-one-components/frame/defaultSettings'
// 来获取这个类型
export interface Settings {
  /** Theme for nav menu */
  navTheme: 'light' | 'dark';
  /** Primary color of ant design */
  primaryColor: string;
  /** Nav menu position: `side` or `top` */
  layout: 'side' | 'top';
  /** Layout of content: `Fluid` or `Fixed`, only works when layout is top */
  contentWidth: 'Fluid' | 'Fixed';
  /** Sticky header */
  fixedHeader: boolean;
  /** Sticky siderbar */
  fixSiderbar: boolean;
  menu: { locale: boolean };
  title: string;
  pwa: boolean;
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: string;
  colorWeak: boolean;
}
```

### MenuDataItem

```ts | pure
// 可以通过 import { MenuDataItem } from '@ty-one-components/frame'
// 来获取这个类型

export interface MenuDataItem {
  authority?: string[] | string;
  routes?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  path: string;

  [key: string]: any;
}
```

### Route

```ts | pure
// 可以通过 import { RouterTypes } from '@ty-one-components/frame/lib/typings';
// 来获取这个类型
export interface Route {
  path: string;
  routes: Array<{
    exact?: boolean;
    icon: string;
    name: string;
    path: string;
    // 可选二级菜单
    routes?: Route['routes'];
  }>;
}
```

### Footer

页脚一般一般会展示一些公司和版权信息，默认的 frame 不提供 Footer,但是提供了一个 Footer 组件，支持配置一些超链接和一些版权信息。

```tsx | pure
<Footer
  copyright="@2019 蚂蚁金服体验技术部出品"
  links={[
    {
      key: 'Ant Design Pro',
      title: 'Ant Design Pro',
      href: 'https://pro.ant.design',
      blankTarget: true,
    },
    {
      key: 'github',
      title: <GithubOutlined />,
      href: 'https://github.com/ant-design/ant-design-pro',
      blankTarget: true,
    },
    {
      key: 'Ant Design',
      title: 'Ant Design',
      href: 'https://ant.design',
      blankTarget: true,
    },
  ]}
/>
```

### GridContent

GridContent 是个简单的语法糖，封装了 frame 的 `contentWidth` 配置，`contentWidth` 如果设置为 `Fixed` 定宽模式，最宽只有 `1200px`。

使用方式：

```tsx | pure
<GridContent>{children}</GridContent>
```

### RouteContext

RouteContext 提供一个可以根据 layout 的数据来进行一些操作, PageContainer 和 FooterToolbar 都是依赖 RouteContext 的数据来实现功能。

```tsx | pure
import { RouteContext, RouteContextType } from '@ty-one-components/frame';

const Page = () => (
  <RouteContext.Consumer>
    {(value: RouteContextType) => {
      const { isMobile, hasHeader, hasSiderMenu, collapsed } = value;
      // 用户的标题
      return value.title;
    }}
  </RouteContext.Consumer>
);
```

## FAQ

### 自定义布局

frame 提供一些 api 删除用户不需要的区域。在 SettingDrawer 也提供一些配置来进行设置。

![setting-drawer-render](https://gw.alipayobjects.com/zos/antfincdn/mCXDkK2pJ0/60298863-F5A5-4af2-923A-13EF912DB0E1.png)

- `headerRender` 可以自定义顶栏
- `footerRender` 可以自定义页脚
- `menuRender` 可以自定义菜单区域
- `menuHeaderRender` 自定义的菜单头区域
- `menuExtraRender` 可以为菜单增加一个额外内容，在菜单头和菜单之间

> 在 layout 中所有的 xxxRender 都可以传入 false，来关闭渲染。

### 和 umi 一起使用

frame 与 umi 配合使用会有最好的效果，umi 会把 config.ts 中的路由帮我们自动注入到配置的 layout 中，这样我们就可以免去手写菜单的烦恼。

frame 扩展了 umi 的 router 配置，新增了 name，icon，locale,hideInMenu,hideChildrenInMenu 等配置，这样可以更方便的生成菜单，在一个地方配置即可。数据格式如下：

```ts | pure
export interface MenuDataItem {
  /** @name 子菜单 */
  routes?: MenuDataItem[];
  /** @name 在菜单中隐藏子节点 */
  hideChildrenInMenu?: boolean;
  /** @name 在菜单中隐藏自己和子节点 */
  hideInMenu?: boolean;
  /** @name 在面包屑中隐藏 */
  hideInBreadcrumb?: boolean;
  /** @name 菜单的icon */
  icon?: React.ReactNode;
  /** @name 自定义菜单的国际化 key */
  locale?: string | false;
  /** @name 菜单的名字 */
  name?: string;
  /** @name 用于标定选中的值，默认是 path */
  key?: string;
  /** @name disable 菜单选项 */
  disabled?: boolean;
  /** @name 路径,可以设定为网页链接 */
  path?: string;
  /**
   * @deprecated 当此节点被选中的时候也会选中 parentKeys 的节点
   * @name 自定义父节点
   */
  parentKeys?: string[];
  /** @name 隐藏自己，并且将子节点提升到与自己平级 */
  flatMenu?: boolean;
  /** @name 指定外链打开形式，同a标签 */
  target?: string;

  [key: string]: any;
}
```

frame 会根据 `location.pathname` 来自动选中菜单，并且自动生成相应的面包屑。如果不想使用可以自己配置 `selectedKeys` 和 `openKeys` 来进行受控配置。

### 收起展开

一些时候我们会发现 `collapsed` 和 `onCollapse` 设置默认收起并不生效，这是因为 frame 中内置了 `breakpoint` 来触发收起的机制，我们可以设置 `breakpoint={false}` 来关掉这个机制。

### 自定义菜单的宽度

siderWidth 可以自定义菜单的宽度，你可以设置的更短或者更长 FooterToolbar 等组件会自动支持，但是可能需要做一些样式上的处理，不然菜单展示可能会有一些小问题。

菜单收起宽度是无法自定义的，因为涉及到动画和巨量的 css 改动，自定义难度很大。

### 自动切割菜单

自动切割菜单是 `mix` 模式专属的能力，他可以把第一级的菜单放置到顶栏中。我们可以设置 `splitMenus=true` 来打开它，为了体验良好最好给每个一级菜单都设置一个重定向,这样可以防止切换到白屏页面。

![切割菜单](https://gw.alipayobjects.com/zos/antfincdn/H9hDMcrUh1/5438EB45-27F8-4B4F-8740-54F7BE55075C.png)

### 自定义菜单

frame 会自动生成菜单，同时根据 pathname 进行自动选中。配合 PageContainer 可以实现自动推算面包屑和页面标题。如果和 umi 配置使用，只需要将 Page 的 props 交给 frame，frame 会根据 config 中的 routers 的配置可以自动生成菜单。

为了提供更多的功能，我们扩展了 routers 配置，增加了几个配置方便自定义，数据结构定义如下:

```ts | pure
// 可以通过 import { MenuDataItem } from '@ty-one-components/frame'
// 来获取这个类型
export interface MenuDataItem {
  routes?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  path: string;
  [key: string]: any;
}
```

- name 用于配置在菜单中的名称，同时会修改为浏览器标签页标题
- icon 代表菜单的图标，只 antd 的图标，iconfont 需要自己定义
- locale 可以设置菜单名称的国际化表示
- hideInMenu 会把这个路由配置在 menu 中隐藏这个路由，name 不填会有相同的效果
- hideChildrenInMenu 会把这个路由的子节点在 menu 中隐藏

> frame 其实是读取的 props 中的 route 和 location。这两个属性是 umi 默认注入的。

### 从服务器获取

有些时候我们希望服务器来管理我们的路由，所以希望菜单时服务器进行分发的数据。我们提供了 `menuDataRender` 来进行修改数据，但是要注意 `menuDataRender` 会触发重新渲染，并且还会支持的国际化和权限的配置，如果你不需要国际化，建议使用 `postMenuData` 可以显著的提升性能。

服务器需要返回的数据与 `MenuDataItem` 相同，`menuDataRender` 需要返回一个数组，如果你想拥有更好的性能可以试试使用 props 中的 route 属性，这里有个 [demo](/components/layout#从服务器加载-menu)。

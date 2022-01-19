---
nav:
  title: one-start
  order: 1
  path: /one-start
title: os-trigger
group:
  title: general
  path: /one-start/general
---

# os-trigger

## 代码演示

### 基础使用

<code src="../demos/trigger/simple.tsx" />

### 下拉菜单项样式

<code src="../demos/trigger/menu-style.tsx" />

### 菜单项嵌套

因为提供了默认下拉的 UI 语言，所以将 `trigger` 内敛为单一 `click` 模式，这样不仅对 `Dialog` 嵌套交互更加友好，也不会对我们的客户操作造成直觉困惑，同时 `contextMenu` 也不适用于 trigger 组件

下拉框 `overlay` 的 `zIndex` 默认比常用 `modal`, `drawer` 要高，所以会形成遮挡，我们可以调整 `overlayZIndex` 来调整

<code src="../demos/trigger/in-menu.tsx" />

### 自动弹出外层 dialog

弹出后，等待执行结果返回，期间自动禁用

<code src="../demos/trigger/auto-open.tsx" />

### 嵌套反馈

<code src="../demos/trigger/nesting.tsx" />

### 异步操作，同步设置 loading

<code src="../demos/trigger/async-request.tsx" />

### 异步获取下拉菜单

<code src="../demos/trigger/async-menu.tsx" />

### 提示信息

<code src="../demos/trigger/tooltip.tsx" />

### 简单样式

<code src="../demos/trigger/plain.tsx" />

### 上传文件

<code src="../demos/trigger/upload.tsx" />

<API exports='["TriggerButtonSettings", "TriggerButtonAPI", "TriggerButtonRequests"]' src="../components/trigger/index.tsx"></API>

<API exports='["TriggerDropdownSettings", "TriggerDropdownAPI", "TriggerDropdownRequests"]' src="../components/trigger/index.tsx"></API>

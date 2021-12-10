---
nav:
  title: one-start
  order: 2
  path: /one-start
title: os-layout-form
group:
  title: forms
  path: /one-start/forms
---

# os-layout-form

## 代码演示

### 拟态表单受控

<code src="../demos/layout-form/modal-form.tsx" />

### 拟态表单验证错误

<code src="../demos/layout-form/modal-form-validate-error.tsx" />

### 拟态表单展示

<code src="../demos/layout-form/modal-form-detail.tsx" />

### Tabs 表单异步获取数据

<code src="../demos/layout-form/tabs-form-simple" />

### Tabs 表单 API 操作

<code src="../demos/layout-form/tabs-form-apis" />

### Tabs 表单展开收起

<code src="../demos/layout-form/tabs-form-collapse" />

### Tabs 表单展示

<code src="../demos/layout-form/tabs-form-show" />

LayoutFormAPIBase 为公共的 api，具体 LayoutForm 各自继承实现

<API exports='["LayoutFormAPIBase"]' src="../components/layout-form/index.tsx"></API>

<API exports='["LayoutModalFormSettings", "LayoutModalFormAPI"]' src="../components/layout-form/index.tsx"></API>

<API exports='["LayoutTabsFormSettings", "LayoutTabsFormAPI"]' src="../components/layout-form/index.tsx"></API>

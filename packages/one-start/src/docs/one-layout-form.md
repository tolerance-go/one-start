---
nav:
  title: one-start
  order: 1
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

### Steps 表单按步骤验证提交

<code src="../demos/layout-form/steps-form-validate" />

### Steps 表单 API 操作

在 `Steps` 表单中进入上下步骤前会对表单项进行校验，所以可以假设已经完成的步骤是绝对可用的表单，未来步骤的表单处于未到达状态，因此 `Steps` 的 `validate` 方法验证的是 `current` 表单的内容

<code src="../demos/layout-form/steps-form-apis" />

LayoutFormAPIBase 为公共的 api，具体 LayoutForm 各自继承实现

<API exports='["LayoutFormAPIBase"]' src="../components/layout-form/index.tsx"></API>

<API exports='["LayoutModalFormSettings", "LayoutModalFormAPI"]' src="../components/layout-form/index.tsx"></API>

<API exports='["LayoutTabsFormSettings", "LayoutTabsFormAPI"]' src="../components/layout-form/index.tsx"></API>

---
nav:
  title: components
  order: 1
  path: /components
title: os-dialog
group:
  title: general
  path: /components/general
---

# os-dialog

## 代码演示

### 函数式调用

<code src="../demos/dialog/functional.tsx" />

### 等待弹窗关闭

等待弹关闭

<code src="../demos/dialog/await-visible.tsx" />

### 等待弹窗确认

等待弹出确认，取消或关闭

<code src="../demos/dialog/await-confirm.tsx" />

### 警告确认

<code src="../demos/dialog/danger-comfirm.tsx" />

### 额外操作

<code src="../demos/dialog/actions.tsx" />

### 确认类型

<code src="../demos/dialog/confirm-type.tsx" />

DialogAPIBase 为公共的 api，具体 dialog 各自继承实现

<API exports='["DialogAPIBase"]' src="../components/dialog/index.tsx"></API>

<API exports='["DialogMessageSettings", "DialogMessageAPI"]' src="../components/dialog/index.tsx"></API>

<API exports='["DialogPopoverSettings", "DialogPopoverAPI"]' src="../components/dialog/index.tsx"></API>

<API exports='["DialogPopconfirmSettings", "DialogPopconfirmRequests", "DialogPopconfirmAPI"]' src="../components/dialog/index.tsx"></API>

<API exports='["DialogModalSettings", "DialogModalAPI"]' src="../components/dialog/index.tsx"></API>

<API exports='["DialogmodalOperationSettings", "DialogModalOperationRequests", "DialogModalOperationAPI"]' src="../components/dialog/index.tsx"></API>

<API exports='["DialogDrawerSettings", "DialogDrawerRequests", "DialogDrawerAPI"]' src="../components/dialog/index.tsx"></API>

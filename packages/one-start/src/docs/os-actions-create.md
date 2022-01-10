---
nav:
  title: one-start
  order: 1
  path: /one-start
title: os-actions-create
group:
  title: actions
  path: /one-start/actions
---

# os-actions-create

## 代码演示

### 基础使用

<code src="../demos/actions/create/simple.tsx" />

### 编辑记录本地持久化

`enablePersistence` 开启后，用户输入将在本地进行持久化保存，下次打开弹窗将默认恢复表单值

<code src="../demos/actions/create/local.tsx" />

### 创建模板管理

`enableTemplate` 开启后，将可以进行多套表单值持久化，并且通过相关接口实现网络存储

应用模板后，将先重置表单，再重新赋值

<code src="../demos/actions/create/template.tsx" />

<API exports='["ActionsCreateSettings", "ActionsCreateRequests"]' src="../actions/create/index.tsx"></API>

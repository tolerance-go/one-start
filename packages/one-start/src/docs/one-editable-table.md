---
nav:
  title: one-start
  order: 1
  path: /one-start
title: os-editable-table
group:
  title: tables
  path: /one-start/tables
---

# os-editable-table

## 代码演示

### 基础使用

<code src="../demos/editable-table/simple.tsx" />

### 控制新增行方向

`addable.direction` 可以控制新增方向

<code src="../demos/editable-table/direction.tsx" />

### 自定义新增行内容

通过 `requestNewRecordData` 支持自定义新增行内容，设置 `initialValue` 可以定义新增行初始值，其优先级更低

<code src="../demos/editable-table/request-new-record-data.tsx" />

### 自定义新增按钮是否可用

<code src="../demos/editable-table/add-disabled.tsx" />

### 删除行内容

<code src="../demos/editable-table/request-delete-record.tsx" />

### 单元格验证

<code src="../demos/editable-table/validate.tsx" />

### 分页编辑

<code src="../demos/editable-table/pagination.tsx" />

所有接口继承自 OSTable

<API exports='["Settings", "EditableTableAddable"]' src="../components/editable-table/index.tsx"></API>

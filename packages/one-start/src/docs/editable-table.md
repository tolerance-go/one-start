---
nav:
  title: components
  order: 1
  path: /components
title: editable-table
group:
  title: tables
  path: /components/tables
---

# editable-table

## 代码演示

### 基础使用

<code src="../demos/editable-table/simple.tsx" />

### 控制新增行方向

`addable.direction` 可以控制新增方向

<code src="../demos/editable-table/direction.tsx" />

### 自定义新增行内容

通过 `requestNewRecordData` 支持自定义新增行内容，设置 `initialValue` 可以定义新增行初始值，其优先级更低

注意：返回的 `data` 需要自行 `merge rowData`

<code src="../demos/editable-table/request-new-record-data.tsx" />

### 自定义新增按钮是否可用

<code src="../demos/editable-table/add-disabled.tsx" />

### 删除行内容

`editable` 继承自 `table`，因此可以使用 `rowActions` 进行操作列的定义

<code src="../demos/editable-table/request-delete-record.tsx" />

### 单元格验证

<code src="../demos/editable-table/validate.tsx" />

### 分页编辑

<code src="../demos/editable-table/pagination.tsx" />

### 列视图

#### 支持单列类型联动变化

<code src="../demos/editable-table/column-type-linkage.tsx" />

#### 支持本地化的编辑新增删除

formData 和 formValue 的区别在于前者的 value 可能包含注册表单字段以外的数据， 而后者只包含注册表单字段的数据，比如 表格 rowData 中包含自定义字段 \_id，它不是 注册的 form item 上的 name，所以 formValue 中不包含 \_id，而 formData 包含了

<code src="../demos/editable-table/localized-edits-added-delete.tsx" />

所有接口继承自 OSTable

<!-- <API exports='["Settings", "EditableTableAddable"]' src="../components/editable-table/index.tsx"></API> -->

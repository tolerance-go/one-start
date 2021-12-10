---
nav:
  title: one-start
  order: 2
  path: /one-start
title: os-table
group:
  title: tables
  path: /one-start/tables
---

# os-table

## 代码演示

### 搜索表单

收起后，隐藏表头搜索控件，并在表头顶部显示搜索控件

<code src="../demos/table/search-form.tsx" />

### 下拉选项映射

如果 select field 设置了 showSearch，则在表格搜索时不会进行下拉选项搜索，因为此时内容和 value 可能无法映射导致空值

<code src="../demos/table/select.tsx" />

### 单元格编辑

editableRowKeys 存在的时候，将和 `fieldItems[].editable` 共同决定单元格是否可以编辑

<code src="../demos/table/edit.tsx" />

### 列宽调整

拖动列宽展开内容超出宽度的列，`resizeable` 可以控制列宽调整是否开启

<code src="../demos/table/column-resizing.tsx" />

### 列设置

切换复选框可以控制列（组）的显示和隐藏

拖动列树可以进行重新排序和分组

<code src="../demos/table/column-settings.tsx" />

### tree grid

大数据量展示，同时渲染 10 万条数据

<code src="../demos/table/grid-tree.tsx" />

### 树形表格联动选择

树形表格联动选择

<code src="../demos/table/tree-table.tsx" />

### 批量操作

选择列后，激活批量操作按钮

<code src="../demos/table/batch-actions.tsx" />

### 行操作

<code src="../demos/table/row-actions.tsx" />

### 列提示信息

<code src="../demos/table/tooltip.tsx" />

### 单元格浮窗展示全文

<code src="../demos/table/ellipsis-tooltip.tsx" />

### 配置持久化

<code src="../demos/table/local.tsx" />

### 列配置隐藏

<code src="../demos/table/column-hide.tsx" />

### 单元格高亮

<code src="../demos/table/highlight.tsx" />

### 搜索表单值 URL 持久化

传递 `tableKey` 自动开启搜索表单值与 URL search 参数同步，同步时机为手动执行搜索操作时

<code src="../demos/table/state-query.tsx" />

### API 接口

<code src="../demos/table/apis.tsx" />

<code src="../demos/table/dev-empty.tsx" />

<API exports='["TableSettings", "TableAPI"]' src="../components/table/index.tsx"></API>

### TableFormFieldItems

类型根据 type 推导，比如 type 为 digit 将继承所有 field-digit 配置，同时混入了其他类型如下

`**FieldType**` & `OSTableFormGroupItem` & `OSFormItemDependenciesConfigs` & `OSFormItemType` & `OSTableFormFieldItemExtra`

TableFormGroupItem 存在 children 字段，类型和 fieldItems 相同

fieldItem 每一项都可能为函数形式，表示联动，入参为 `OSTableFormFieldItemSettingsFnOption`，注意必须指定 `dependencies`

<API exports='["TableFormFieldItemSettingsFnOption", "TableFormFieldItemExtraSettings", "TableFormGroupItem"]' src="../components/table/index.tsx"></API>

<API exports='["FormItemDependenciesConfigs"]' src="../components/form/index.tsx"></API>

<API exports='["FormItemTypeSettings"]' src="../components/form/index.tsx"></API>

<API exports='["FormItemTypeRequests"]' src="../components/form/index.tsx"></API>

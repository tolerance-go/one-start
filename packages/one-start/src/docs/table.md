---
nav:
  title: components
  order: 1
  path: /components
title: table
order: -1
group:
  title: tables
  path: /components/tables
tocMaxDepth: 5
---

# table

## 功能演示

### 搜索视图

#### 支持表单字段展开收起更多

界面上支持用户显示和关闭搜索表单的功能；当搜索字段超过指定行数时支持展开和收起更多字段的功能，最大显示行数可以通过 `searchFormItemChunkSize` 控制，默认为 2；

#### 支持表单数据与 URL 状态同步

当传递 `tableKey` 时，通过 `syncURLParams` 开启搜索表单内容自动同步 URL 参数的功能，默认开启，同步时机为手动执行搜索操作时

#### 支持 type-schema 方式快速定义搜索字段

支持 schmea 方式来定义表格列

```tsx | pure
[
  {
    type: 'text',
    settings: {
      title: 'field:only-in-table',
      dataIndex: 'field',
    },
  },
  {
    type: 'date-range',
    settings: {
      title: 'field:only-in-search',
      dataIndex: 'field',
      search: 'only',
      initialValue: [moment().subtract(7, 'd'), moment()],
    },
  },
];
```

#### 支持搜索表单布局调整

```tsx | pure
({
  searchFormSettings: {
    groupItemSettings: {
      gutter: 10,
    },
    fieldItemSettings: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
      labelAlign: 'left',
      readonly: true,
      colSpan: 8,
    },
  },
});
```

#### 支持搜索字段展示提示信息

```tsx | pure
[
  {
    type: 'money',
    settings: {
      title: 'money',
      dataIndex: 'money',
      rules: [
        {
          required: true,
        },
      ],
      search: true,
      sorter: true,
      id: 't_money',
      tooltip: ['提示信息第一行', '提示信息第二行'],
    },
  },
];
```

#### 支持搜索表单设置初始值

可以配置 `initialValue` 参数来初始化搜索字段

#### 支持单独定义搜索字段，区分表格列

如果配置为 search: true 支持同时定义搜索项，当二者差异较大时，可以通过 `search: 'only'` 区分显示

#### 支持搜索字段之间联动

搜索表单是在 Form 的基础上进行的封装，支持 Form 大部分功能，比如可以通过 dependencies 配合函数 settings 实现字段之间的联动

#### 支持搜索表单字段验证

搜索表单可以设置定义验证规则，在搜索前如果验证失败会停止搜索

<code src="../demos/table/search-form.tsx" />

### 支持操作区域自定义渲染

<code src="../demos/table/actions-render.tsx" />

### 列视图

#### 支持 select 类型列下拉选项缓存

如果 select field 设置了 `showSearch: true`，则在表格搜索时不会进行下拉选项搜索，因为此时内容和 value 可能无法映射导致空值

<code src="../demos/table/select.tsx" />

### 单元格视图

#### 支持单元格定义编辑规则

editableRowKeys 存在的时候，将和 `fieldItems[].editable` 共同决定单元格是否可以编辑

当设置了 `changedValueHasMeta: true`，onChange 的 event 会携带更多编辑相关信息，比如当前编辑的行和列

注意：当 `changeDebounceTimestamp > 0` 的时候，用户输入可能触发 onChange 多个单元格变化

<code src="../demos/table/edit.tsx" />

#### 支持单元格编辑值前后变化状态显示

设置 `enableEditedCellDiffValueState: {}` 来启动编辑后，值发生变化的单元格用颜色来进行区分

#### 支持用户主动保存编辑后数据

设置 `enableEditedCellSaveAction: {}` 来启动编辑后，可以对值发生的变化单元格进行异步保存，组件会显示”保存“按钮，点击后触发 `requests.requestEditedCellToSave` 如果返回无错误，则会恢复对应的单元格状态

<code src="../demos/table/edit-value-diff.tsx" />

编辑表格的验证 `validateTrigger` 都必须设置为 `[]`，以在提交的时候判断，因为有联动，会导致值变化，错误信息的机制是这样的，一旦有新的值，会导致重置错误信息

准确来说，是有联动的编辑表格要注意，而且如果是简单 `input` 是不会这样的，因为判断 `value` 是否变化用的是 `===`，编辑表格的值是一个对象，数据不可变原则，所以联动计算前后 2 个数组对象用 `===` 判断一定会改变，像 `input`，如果联动计算出的值是 `"new"`，而之前的值也是 `"new"` ，2 个字符串比较内容是一样的，就不会触发改变

如果依旧想在用户编辑的时候提示错误，方法是在表格单元格上写验证

注意：`table` 使用 `form` 包裹，`fieldItem` 中自定义 `rule` 直接调用 `getFieldsValue` 拿到的对象数据第一层级是 `rowId`

> 关于表格单元格验证提示信息，当滚动表格时，默认行为是先隐藏再显示，如果单元格不可见（被 fixed 列覆盖）则直接隐藏

<code src="../demos/table/edit-validate-cell.tsx" />

#### 支持单元格显示更多内容

<code src="../demos/table/cell-tooltip.tsx" />

### 列宽调整

拖动列宽展开内容超出宽度的列，`resizeable` 可以控制列宽调整是否开启

<code src="../demos/table/column-resizing.tsx" />

### 列设置

支持通过列设置看板操作，实现控制列（组）的显示和隐藏，重新排序，固定列头列尾

因为 table 的 DOM 渲染机制，删除或者新增列时，列数量越多，pageSize 越大，则预渲染时间越长，因此这里使用了代理操作的方式，也就是说需要最终点击确认或者重置才会真正开始渲染表格

<code src="../demos/table/column-settings.tsx" />

<!-- ### tree grid

大数据量展示，同时渲染 10 万条数据

<code src="../demos/table/grid-tree.tsx" /> -->

### 树形表格联动选择

树形表格联动选择

<code src="../demos/table/tree-table.tsx" />

### 行批量选择及操作

通过 `batchOperation` 参数返回非空 `ReactNode` 数组，来设置行批量操作，默认开启行选择器

通过 `rowSelection.selections` 开启额外的行批量选择模式

> 暂时不支持后端分页下的选择当前页和前端分页下的选择全部等

<code src="../demos/table/batch-actions.tsx" />

### 行操作

列为空的时候，默认不显示行操作

通过 `rowActions.width` 可以控制操作列宽度

<code src="../demos/table/row-actions.tsx" />

### 列提示信息

<code src="../demos/table/tooltip.tsx" />

### 单元格浮窗展示全文

<code src="../demos/table/ellipsis-tooltip.tsx" />

### 列配置隐藏

<code src="../demos/table/column-hide.tsx" />

### 单元格高亮

表格预设了 3 种高亮颜色和文案：`warning`, `error`, `success`，通过设置 `highlightBadge` 可以控制工具栏高亮徽章的类型数量和文案等信息；通过设置 `fieldItems[number].settings.highlight` 控制选中单元格高亮类型

<code src="../demos/table/highlight.tsx" />

### 异步获取表头信息

<code src="../demos/table/async-get-columns.tsx" />

### 前端分页

<code src="../demos/table/fe-pagination.tsx" />

### 后端分页

<code src="../demos/table/be-pagination.tsx" />

### 层级 dataIndex

可以使用数组形式取 `rowData` 对象中任意层级的值进行列渲染，但是编辑形态下，暂时限制为 `string` 类型

<code src="../demos/table/data-index-level.tsx" />

### 轮询查询

开启轮询后，默认显示左下角搜索时间戳，使用户感觉到数据在实时更新

<code src="../demos/table/poll-the-query.tsx" />

### 行支持点击选中样式

点击行后高亮整行，方便在查看详情后返回时，快速定位当前行

通过 `rowSelection.type = 'click-hightlight'` 开启

<code src="../demos/table/rows-support-clicking-to-select-the-style.tsx" />

## API 接口

<code src="../demos/table/apis.tsx" />

<code src="../demos/table/dev-empty.tsx" />

<code src="../demos/__cases__/table/nest-form-cell-tooltip-close.tsx" />

<code src="../demos/__cases__/form/form-item-warning-not-close.tsx" />

<!-- <API exports='["TableSettings", "TableAPI"]' src="../components/table/views/index.tsx"></API> -->

### TableFormFieldItems

类型根据 type 推导，比如 type 为 digit 将继承所有 field-digit 配置，同时混入了其他类型如下

`**FieldType**` & `OSTableFormGroupItem` & `OSFormItemDependenciesConfigs` & `OSFormItemType` & `OSTableFormFieldItemExtra`

TableFormGroupItem 存在 children 字段，类型和 fieldItems 相同

fieldItem 每一项都可能为函数形式，表示联动，入参为 `OSTableFormFieldItemSettingsFnOption`，注意必须指定 `dependencies`

<!-- <API exports='["TableFormFieldItemSettingsFnOption", "TableFormFieldItemExtraSettings", "TableFormGroupItem"]' src="../components/table/views/index.tsx"></API> -->

<!-- <API exports='["FormItemDependenciesConfigs"]' src="../components/form/index.tsx"></API> -->

<!-- <API exports='["FormItemTypeSettings"]' src="../components/form/index.tsx"></API> -->

<!-- <API exports='["FormItemTypeRequests"]' src="../components/form/index.tsx"></API> -->

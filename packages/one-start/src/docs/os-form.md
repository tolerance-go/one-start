---
nav:
  title: components
  order: 1
  path: /components
title: os-form
group:
  title: forms
  path: /components/forms
---

# os-form

## 代码演示

### 基础使用

1. 展示编辑表格字段时，设置 `fieldItem.title` 为空，则不会出现 label，同时设置 `labelCol: { span: 0, }`，`wrapperCol: { span: 24, }` 可以完整一行展示

<code src="../demos/form/simple.tsx" />

### 分组

<code src="../demos/form/group.tsx" />

### 属性联动

如果 settings 为函数，则必须存在 dependencies 属性

<code src="../demos/form/attrs-linkage.tsx" />

### 计算联动

#### 同步计算联动

<code src="../demos/form/sync-linkage.tsx" />

#### 异步计算联动

<code src="../demos/form/async-linkage.tsx" />

#### 去中心化

<code src="../demos/form/linkage-remove-center.tsx" />

### 表单异步验证

data 的类型根据 error 变化，当 error 为 `false` 时，data 的数据类型为 `ValidateErrorEntity`，否则为表单的字端数据

```ts
export interface ValidateErrorEntity<Values = any> {
  values: Values;
  errorFields: {
    name: InternalNamePath;
    errors: string[];
  }[];
  outOfDate: boolean;
}
```

<code src="../demos/form/validate.tsx" />

### 表单警告验证

警告验证和 rules api 同构，不会导致 validate 返回错误

<code src="../demos/form/warning-rule.tsx" />

### 表单内置验证

one-start 表单内部设置了数值精度校验和日期早晚校验

<code src="../demos/form/rule-type.tsx" />

### 展示型表单

<code src="../demos/form/readonly.tsx" />

### 表单数据受控

<code src="../demos/form/value-onchange.tsx" />

### 公共 field-item 配置

`fieldItem` 包含 `formItem` 及 `inputItem`，后者全部的配置打平到了一起方便使用

<code src="../demos/form/field-item-settings.tsx" />

### 显示联动

<code src="../demos/form/group-visible-switch.tsx" />

### 初始值

<code src="../demos/form/async-initial.tsx" />

### 表单类型字段的校验

<code src="../demos/form/rich-form-in-form.tsx" />

### 编辑表格字段自动填充 rowId

如果表格有插入和删除等改变行顺序的操作，需要保证 rowId 唯一

<code src="../demos/form/editable-table-auto-row-id.tsx" />

### 表单布局

<code src="../demos/form/layout.tsx" />

### 空状态

<code src="../demos/form/empty-state.tsx" />

### 修改历史 <Badge>beta</Badge>

获取历史修改数据等额外信息，和 `requestDataSource` 一起只触发一次，优先级 `requestRichDataSource` 更高

<code src="../demos/form/history-field.tsx" />

### 组件内部共享数据

表单数据可以设置字段以外的数据，比如示例中的 `max`, `valueEnums`，字段的验证规则等配置可以直接使用，但是调用 `getDataSource` 或者 `validate` 只能拿到声明字段的数据集合，因此表单提供了 `setRefObject` 和 `getRefObject` 帮助用户拿到声明字段以外的数据

<code src="../demos/form/ref-object.tsx" />

### 修改前拦截数据

值的联动属于 `post change`，会触发额外的修改事件，如果要在修改事件之前处理 `value`，可以通过 `valueTransform`

> 其他原因，暂时只在 `placeholder-input` 上实现，后续有需求再迁移到 `form` 级别

<code src="../demos/form/value-transform.tsx" />

<API exports='["FormSettings", "FormRequests", "FormAPI"]' src="../components/form/index.tsx"></API>

### FormFieldItems

类型根据 type 推导，比如 type 为 digit 将继承所有 field-digit 配置，同时混入了其他类型如下

`**FieldType**` & `OSFormGroupItemType` & `OSFormItemDependenciesConfigs` & `OSFormFieldItemExtra` & `OSFormItemType`

FormGroupItemType 存在 children 字段，类型和 fieldItems 相同

fieldItem 每一项都可能为函数形式，表示联动，入参为 `OSFormFieldItemSettingsFnOption`，注意必须指定 `dependencies`

<API exports='["FormFieldItemSettingsFnOption", "FormFieldItemExtraSettings"]' src="../components/form/index.tsx"></API>

<API exports='["FormGroupItemType"]' src="../components/form/index.tsx"></API>

<API exports='["FormItemDependenciesConfigs"]' src="../components/form/index.tsx"></API>

<API exports='["FormItemTypeSettings"]' src="../components/form/index.tsx"></API>

<API exports='["FormItemTypeRequests"]' src="../components/form/index.tsx"></API>

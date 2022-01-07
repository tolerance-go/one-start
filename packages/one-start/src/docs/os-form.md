---
nav:
  title: one-start
  order: 1
  path: /one-start
title: os-form
group:
  title: forms
  path: /one-start/forms
---

# os-form

## 代码演示

### 基础使用

<code src="../demos/form/simple.tsx" />

### 分组

<code src="../demos/form/group.tsx" />

### 属性联动

如果 settings 为函数，则必须存在 dependencies 属性

<code src="../demos/form/attrs-linkage.tsx" />

### 同步计算联动

当 a，b，c 中前者字段变化，清空所有排在后面的字段

当修改 d 中表格行数据，另外一行数据和他联动，保证相反

<code src="../demos/form/sync-linkage.tsx" />

### 异步计算联动

串行异步配置中，当 a 变化后，1s 后，b 的值会放大 10 倍，再过 1s，c 的值会根据 b 的值放大 10 倍

并行异步配置中，当 a 变化后，2s 后，b 的值会设置为 a 的变化值，3s 后，b 的值会设置为 a 的变化值的 2 倍

串行也被作为一个并行线，当所有并行线有结果后返回，根据返回时间进行 merge，b 的值最晚被 `a-b-long` 修改，因此最终 b 的结果为 a 的变化值的 2 倍

<code src="../demos/form/async-linkage.tsx" />

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

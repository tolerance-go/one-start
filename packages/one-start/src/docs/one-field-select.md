---
nav:
  title: one-start
  order: 1
  path: /one-start
title: os-field-select
group:
  title: fields
  path: /one-start/fields
---

# os-field-select

## 代码演示

### 基础使用

<code src="../demos/field-select/simple.tsx" />

### 下拉多选

<code src="../demos/field-select/multiple.tsx" />

### 远程搜索

<code src="../demos/field-select/remote-search.tsx" />

### 枚举类型选项

<code src="../demos/field-select/value-enums.tsx" />

### 异步获取下拉选项

<code src="../demos/field-select/async-options.tsx" />

### 无边框模式

无边框模式样式和展示样式对齐

<code src="../demos/field-select/no-border.tsx" />

### value 富对象

方便在表单联动中取值，扩展了 data 字段

<code src="../demos/field-select/label-in-value.tsx" />

### 显示额外信息

<code src="../demos/field-select/show-info.tsx" />

### 占位信息

<code src="../demos/field-select/placeholder.tsx" />

<code src="../demos/field-select/dev.tsx" />

<API exports='["Settings", "Requests"]' src="../components/fields/select/index.tsx"></API>

### API

`export type OSSelectFieldAPI = HTMLSpanElement | (RefSelectProps & OSSelectBaseAPI);`

<API exports='["SelectBaseAPI"]' src="../components/fields/select/index.tsx"></API>

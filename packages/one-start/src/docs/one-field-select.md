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

注意：如果 `options` 太多导致请求响应慢，可以根据 `searchValue` 值判断请求数量

<code src="../demos/field-select/remote-search.tsx" />

### 本地搜索

<code src="../demos/field-select/local-search.tsx" />

### 枚举类型选项

<code src="../demos/field-select/value-enums.tsx" />

### 异步获取下拉选项

1. 默认会进行一次 `options` 拉取，避免 `value` 无对应 label 展示
2. 打开下拉框时，会进行一次 `options` 拉取，保证最新

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

### 表单联动

当 `options` 更新时，如果 `value` 不在选项范围内，注意添加验证通知用户

<code src="../demos/field-select/form-async.tsx" />

<code src="../demos/field-select/dev.tsx" />

<API exports='["Settings", "Requests"]' src="../components/fields/select/index.tsx"></API>

### API

`export type OSSelectFieldAPI = HTMLSpanElement | (RefSelectProps & OSSelectBaseAPI);`

<API exports='["SelectBaseAPI"]' src="../components/fields/select/index.tsx"></API>

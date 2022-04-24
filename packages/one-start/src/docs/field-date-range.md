---
nav:
  title: components
  order: 1
  path: /components
title: field-date-range
group:
  title: fields
  path: /components/fields
---

# field-date-range

## 代码演示

### 基础使用

<code src="../demos/field-date-range/simple.tsx" />

### 字符类型值

<code src="../demos/field-date-range/string-value.tsx" />

### 格式化

<code src="../demos/field-date-range/format.tsx" />

### 指令打开

<code src="../demos/field-date-range/open.tsx" />

### 支持定义时分秒

<code src="../demos/field-date-range/show-time.tsx" />

<!-- <API exports='["Settings"]' src="../components/fields/date-range.tsx"></API> -->

### API

`export type OSDateRangeFieldAPI = HTMLSpanElement | (Component<PickerProps<Moment>, any, any> & OSOpenableFieldBaseAPI);`

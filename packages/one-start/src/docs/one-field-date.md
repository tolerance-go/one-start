---
nav:
  title: one-start
  order: 1
  path: /one-start
title: os-field-date
group:
  title: fields
  path: /one-start/fields
---

# os-field-date

## 代码演示

### 基础使用

<code src="../demos/field-date/simple.tsx" />

### 字符类型值

<code src="../demos/field-date/string-value.tsx" />

### 格式化

<code src="../demos/field-date/format.tsx" />

<API exports='["Settings"]' src="../components/fields/date.tsx"></API>

### API

`export type OSDateFieldAPI = (Component<PickerProps<Moment>, any, any> & OSOpenableFieldBaseAPI) | HTMLSpanElement;`

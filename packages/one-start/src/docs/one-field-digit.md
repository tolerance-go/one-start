---
nav:
  title: one-start
  order: 2
  path: /one-start
title: os-field-digit
group:
  title: fields
  path: /one-start/fields
---

# os-field-digit

## 代码演示

<code src="../demos/field-digit-base.tsx" />

### 大数字

有效数字超过 16 位的时候，需要转换为 string 类型

<code src="../demos/field-digit/big-number.tsx" />

### 格式化

编辑状态下 format 无作用

<code src="../demos/field-digit/format.tsx" />

### 空数据下的展示

<code src="../demos/field-digit/empty.tsx" />

<API exports='["Settings"]' src="../components/fields/digit.tsx"></API>

### API

`export type OSDigitFieldAPI = HTMLInputElement | HTMLSpanElement;`

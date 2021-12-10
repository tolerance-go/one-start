---
nav:
  title: one-start
  order: 2
  path: /one-start
title: os-field-percent
group:
  title: fields
  path: /one-start/fields
---

# os-field-percent

## 代码演示

### 绝对值和小数值

<code src="../demos/field-percent/decimal-data.tsx" />

### 格式化

编辑时，格式化不会产生影响

<code src="../demos/field-percent/format.tsx" />

### 空数据下的展示

<code src="../demos/field-percent/empty.tsx" />

<API exports='["Settings"]' src="../components/fields/percent.tsx"></API>

### API

`export type OSPercentFieldAPI = HTMLInputElement | HTMLSpanElement;`

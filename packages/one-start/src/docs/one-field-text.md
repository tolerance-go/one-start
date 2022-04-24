---
nav:
  title: components
  order: 1
  path: /components
title: os-field-text
group:
  title: fields
  path: /components/fields
---

# os-field-text

## 代码演示

### 基础使用

<code src="../demos/field-text/simple.tsx" />

### 异步获取值

如果 `text == null` 则不会触发 `onChange`，值不会修改，验证也不会触发

<code src="../demos/field-text/async-value.tsx" />

### 前后空格自动 trim

<code src="../demos/field-text/auto-trim.tsx" />

<!-- <API exports='["Settings"]' src="../components/fields/text.tsx"></API> -->

### API

`export type OSTextFieldAPI = HTMLSpanElement | Input;`

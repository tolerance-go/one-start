---
nav:
  title: one-start
  order: 1
  path: /one-start
title: os-field-text
group:
  title: fields
  path: /one-start/fields
---

# os-field-text

## 代码演示

### 基础使用

<code src="../demos/field-text/simple.tsx" />

### 异步获取值

如果 `text == null` 则不会触发 `onChange`，值不会修改，验证也不会触发

<code src="../demos/field-text/async-value.tsx" />

<API exports='["Settings"]' src="../components/fields/text.tsx"></API>

### API

`export type OSTextFieldAPI = HTMLSpanElement | Input;`

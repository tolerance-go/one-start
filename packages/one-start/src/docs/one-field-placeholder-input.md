---
nav:
  title: one-start
  order: 1
  path: /one-start
title: os-field-placeholder-input
group:
  title: fields
  path: /one-start/fields
---

# os-field-placeholder-input

用户输入文本同时，可以插入一些占位符，比如计算公式的输入场景

## 代码演示

### 基础使用

<code src="../demos/field-placeholder-input/simple.tsx" />

### 光标控制

1. 点击模板变量后，会在当前光标后面进行插入
2. 从插入标记末尾 `}` 处进行键盘删除操作，会将最近的开始标记 `{` 包含在内的所有内容进行删除

<code src="../demos/field-placeholder-input/cursor-control.tsx" />

<API exports='["Settings"]' src="../components/fields/placeholder-input.tsx"></API>
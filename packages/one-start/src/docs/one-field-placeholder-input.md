---
nav:
  title: components
  order: 1
  path: /components
title: os-field-placeholder-input
group:
  title: fields
  path: /components/fields
---

# os-field-placeholder-input

用户输入文本同时，可以插入一些占位符，比如计算公式的输入场景

## 代码演示

### 基础使用

弹出框宽度随输入框大小变化

<code src="../demos/field-placeholder-input/simple.tsx" />

### 光标控制

1. 点击模板变量后，会在当前光标后面进行插入
2. 从插入标记末尾 `}` 处进行键盘删除操作，会将最近的开始标记 `{` 包含在内的所有内容进行删除

<code src="../demos/field-placeholder-input/cursor-control.tsx" />

<!-- <API exports='["Settings"]' src="../components/fields/placeholder-input.tsx"></API> -->

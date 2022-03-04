---
nav:
  title: components
  order: 1
  path: /components
title: os-field-relative-day
group:
  title: fields
  path: /components/fields
---

# os-field-relative-day

## 代码演示

### 基本使用

更新组件不会触发 formatter，且 onChange 如果 value 值前后是一样的，只会触发一次 formatter

用户删除字符部分不会触发 formatter 和 onChange

根据[这里](https://github.com/react-component/input-number/blob/7440f52f3305632eda5fc20e1302ddacc7ec50ac/src/InputNumber.tsx#L473)做了一些 hack 处理，强制触发 formatter

<code src="../demos/field-relative-day/simple.tsx" />

<API exports='["Settings"]' src="../components/fields/relative-day.tsx"></API>

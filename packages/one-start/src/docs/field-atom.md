---
nav:
  title: components
  order: 1
  path: /components
title: field-atom
group:
  title: fields
  path: /components/fields
---

# field-atom

## 代码演示

### 支持自定义类型

<code src="../demos/field-atom/simple.tsx" />

<API exports='["Settings"]' src="../components/fields/atom.tsx"></API>

### API

`export type OSAtomFieldAPI = (Component<PickerProps<Moment>, any, any> & OSOpenableFieldBaseAPI) | HTMLSpanElement;`

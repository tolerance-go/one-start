---
nav:
  title: components
  order: 1
  path: /components
title: os-field-upload
group:
  title: fields
  path: /components/fields
---

# os-field-upload

## 代码演示

### 基础使用

默认只做文件选择，不会进行上传操作，可以通过 `immediately` 控制

```jsx | pure
<OSUploadField
  ...
  settings={{
    immediately: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  }}
></OSUploadField>
```

<code src="../demos/field-upload/simple.tsx" />

### 重复校验

<code src="../demos/field-upload/duplication-check.tsx" />

### 尺寸限制

<code src="../demos/field-upload/size-check.tsx" />

<API exports='["Settings"]' src="../components/fields/upload.tsx"></API>

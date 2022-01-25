---
nav:
  title: one-start
  order: 1
  path: /one-start
title: os-field-upload
group:
  title: fields
  path: /one-start/fields
---

# os-field-upload

## 代码演示

### 基础使用

默认只做文件选择，不会进行上传操作，可以通过 `immediately` 控制

```tsx | pure
<OSUploadField
  ...
  settings={{
    immediately: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  }}
></OSUploadField>
```

<code src="../demos/field-upload/simple.tsx" />

<API exports='["Settings"]' src="../components/fields/upload.tsx"></API>

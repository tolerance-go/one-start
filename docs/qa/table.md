---
nav:
  order: 5
  title: Q&A
group:
  title: components
  path: /qa/components
  order: 1
---

# Table

## fieldItems 中的 select 类型字段的 requestOptions 和表格 requestDataSource 的执行顺序是什么？

并行执行，实际完成时间和真实网络快慢有关，不要有共享的依赖

## 为什么不在 table render cell 的时候，主动传递 `size: small` 而是在包裹 table 的 form 上设置？

因为 form-item 的 size，只能根据 provider 来控制；为了使在表格中包裹的 form，它的 size 只影响第一层 table cell 里面的 form-item 和 inputs，而不会影响表格内部弹出框内容的尺寸，我们使用了一个高优先的 size context，在 table form 的外部，并继承 `ConfigProvider.SizeContext` 的值

```jsx | pure
const globalSize = useContext(ConfigProvider.SizeContext);

<PrioritizedComponentSizeContext.Provider value={memo({ size: globalSize })}>
  <Form
    /** 影响表格 cell 内第一层 */
    size="small"
    // ...
  />
</PrioritizedComponentSizeContext.Provider>;
```

组件 size 优先级: props size > default size > prioritized context size > split type context size > antd context size

## 新增组件 API 时，应该方在 props 外层还是 hooks，slots 或者 settings，requests 中？他们的区别是什么？

他们都是 Record，然后 hooks 存放同步的事件执行时钩子，requests 存放异步的数据源钩子，hooks 一般不返回数据，不会影响组件内的行为，slots 存放组件的插槽，settings 存放组件的静态配置项，新增 API 时，如果可以归到上述类别尽量合并进去，特殊设计比如 loading，value，onChange 等例外

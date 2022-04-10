---
nav:
  title: components
  order: 1
  path: /components
title: 功能地图(建设中)
order: -1
group:
  order: -1
  title: general
  path: /components/general
---

# 功能地图(建设中)

开发视角下，以组件为单位，介绍相关功能有哪些，及如何使用等

## 划分逻辑

功能地图就是以组件，视图（较多时），功能的划分逻辑来对整个组件库的功能进行整体描绘的，具体内容如下：

- 组件
  - [子组件]
  - 视图
    - [子视图]
    - 功能
      - [子功能]
      - 状态
        - 状态对应展示
        - 状态联动逻辑
      - 行为
        - 环境触发入口
        - 状态处理逻辑

组件是逻辑单位，包含若干视图，视图也可以偏逻辑或者重展示，视图中包含一系列的状态及操作状态的逻辑，一组状态及行为称之为功能

- 功能
  - demos
  - cases

每个功能都有面向用户的使用案例和面向测试的测试案例，测试案例往往场景和状态较为复杂

> cases 的位置应该为功能定义的组件内，比如单元格编辑提示信息关闭，应该是 table 的 case 而不是 editable-table 的

## 组件及功能

### dialog

- [各种 dialog 存在时的 zindex 优先级](http://localhost:8001/components/general/dialog#dialog-zindex)

### fields

- tree-select

  - [支持树形状态展示](/components/fields/one-field-tree-select#%E6%A0%91%E5%BD%A2%E7%8A%B6%E6%80%81%E5%B1%95%E7%A4%BA)
    - 当选择模式为只选择 子节点 时
  - 支持搜索
    - [支持搜索后连续选择](http://localhost:8002/components/fields/field-tree-select#%E6%90%9C%E7%B4%A2%E5%90%8E%E8%BF%9E%E7%BB%AD%E9%80%89%E6%8B%A9)
    - [支持搜索获取表单其他字段当前值](http://localhost:8002/components/fields/field-tree-select#%E6%94%AF%E6%8C%81%E6%90%9C%E7%B4%A2%E8%8E%B7%E5%8F%96%E8%A1%A8%E5%8D%95%E5%85%B6%E4%BB%96%E5%AD%97%E6%AE%B5%E5%BD%93%E5%89%8D%E5%80%BC)
    - 支持本地搜索
      - 当多选模式下
      - 当 labelInValue 模式下
  - [支持选项配置禁用状态](/components/fields/field-tree-select#支持选项配置禁用状态)
  - [支持设置下拉框内容样式包括高度等](/components/fields/field-tree-select#支持设置下拉框内容样式包括高度等)
  - 支持异步下默认展开全部

- [静态验证规则](/components/forms/os-form#%E8%A1%A8%E5%8D%95%E5%86%85%E7%BD%AE%E9%AA%8C%E8%AF%81)

- field-textarea

  - 支持只读状态
    - 支持快速复制

- field-date

  - 支持选择时间

- field-tree-select

  - 支持富 value 类型

- field-date-range

  - 支持定义时分秒

- field-atom
  - 支持自定义类型

### form

#### form-item

- 支持显示 label
  - [当宽度不够时，显示省略](http://localhost:8001/components/forms/form#form-form-item-label-ellipsis)
- 支持警告验证规则

### table

- [搜索视图](/components/tables/table#搜索视图)

  - 支持 type-schema 方式快速定义搜索字段
  - 支持表单字段展开收起更多
  - 支持表单数据与 URL 状态同步
  - 支持搜索表单布局调整
  - 支持搜索字段之间联动
  - 支持搜索字段展示提示信息
  - 支持搜索表单设置初始值
  - 支持单独定义搜索字段，区分表格列
  - 支持列头独立搜索切换
  - 支持定时器查询

- 数据视图

  - 支持多类型数据映射
  - 支持前后端分页
  - 支持前后端排序
  - 支持前后端分组
  - 支持前端数据过滤

>     - select showSearch 待整理 - text-area 显示更多 待整理

- 列视图

  - 支持 type-schema 方式快速定义列
  - 支持用户自定义列宽
  - 支持用户自定义列排序
  - 支持展示列头提示信息
  - 支持列数据层级映射
  - 支持列高亮展示
  - 支持列隐藏或显示

- [行视图](/components/tables/table#%E8%A1%8C%E6%89%B9%E9%87%8F%E9%80%89%E6%8B%A9%E5%8F%8A%E6%93%8D%E4%BD%9C)

  - 支持行批量操作
  - 支持单行操作
  - 支持用户选中行
  - 支持快捷行选择
    - 支持选择全部
    - 支持全选当前页
    - 支持清空全部
    - 支持清空当前页
    - 支持反选当前页
  - [支持切换行选中样式](/components/tables/os-table#%E8%A1%8C%E6%94%AF%E6%8C%81%E7%82%B9%E5%87%BB%E9%80%89%E4%B8%AD%E6%A0%B7%E5%BC%8F)

- 单元格视图

  - 支持单元格可编辑
    - 支持单元格定义编辑规则
      - 在页面可以左右滚动的时候，隐藏被遮挡单元格错误信息
    - 支持单元格编辑值前后变化状态显示
    - 支持用户主动保存编辑后数据
  - 支持单元格高亮展示
  - 支持单元格展示提示信息
  - 支持编辑单元格提示信息手动关闭
    - 在表单嵌套中使用，修改的防抖时间大于 0 时

### source-table

- [支持详情内容铺平](/components/tables/source-table#支持详情内容铺平)
- [支持一级内容分类](/components/tables/source-table#支持一级内容分类)

- CRUD demo

  - 创建
  - 搜索
  - 查看
    - 更新
  - 编辑
  - 删除
    - 删除尾行自动翻页

- 双栏模式

  - 创建
  - 删除
  - 查看
    - 默认查看第一条

- 三栏模式

- 特殊表单
  - 分布表单

### search-table

- [搜索视图](/components/tables/search-table#%E8%A7%86%E5%9B%BE%E7%AE%A1%E7%90%86)
  - 创建
  - 搜索
  - 应用
  - 更新
  - 删除

### editable-table

- 列视图

  - 支持单列类型联动变化

- CRUD

  - 创建
    - 控制新增行方向
    - 自定义新增行内容
    - 自定义新增按钮状态
      - 是否可用
  - 搜索
  - 查看
    - 更新
  - 编辑
    - 单元格验证
    - 分页编辑
  - 删除

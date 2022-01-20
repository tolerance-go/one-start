# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.10.0](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.9.0...@ty-one-start/one-start@0.10.0) (2022-01-20)


### Features

* os-create 新增 type 参数，支持弹出框和 plain 直接展示 ([1abb197](https://10.1.2.7/visual-fe/swap-modules/commits/1abb1973ab20c2b6ad97bfaee09fb4a7049e99ce))
* os-form 增加 set/get RefObject 方法，支持组件作用域内存储全局数据 ([637458c](https://10.1.2.7/visual-fe/swap-modules/commits/637458c31c02abf5c97f822e7b863a9a192ca263))





# [0.9.0](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.8.0...@ty-one-start/one-start@0.9.0) (2022-01-20)


### Features

* 新增 os-field-upload 组件，支持本地文件受控上传 ([51949d4](https://10.1.2.7/visual-fe/swap-modules/commits/51949d4646d94615576d7b3e3fbcf38faef14ade))
* 新增占位输入控件，支持插入和删除模板变量键盘操作 ([b505eb5](https://10.1.2.7/visual-fe/swap-modules/commits/b505eb5f6a4b774657e59029fb10237a05085ab1))
* os-layout-form 新增 steps 类型，支持步骤创建表单 ([5957548](https://10.1.2.7/visual-fe/swap-modules/commits/5957548a91dc44b1545916453960988c4e7cae35))
* os-trigger 新增 overlayZIndex 参数，支持控制堆叠优先级 ([a7a92e1](https://10.1.2.7/visual-fe/swap-modules/commits/a7a92e15496ea224f8535c2b2d9d428ae8edfba9))
* source-table 编辑场景支持 steps-form 表单类型 ([7fc1e16](https://10.1.2.7/visual-fe/swap-modules/commits/7fc1e16ce8858e1ac7c20281edf96ddf7a89d283))
* steps-form 新增 requestInitialValues 接口，支持异步获取初始表单数据 ([bd9d90a](https://10.1.2.7/visual-fe/swap-modules/commits/bd9d90a071603d818885c40233ff1c6aa436c99a))


### Styles

* os-table 优化 inline 搜索表单和批量操作共存场景下样式布局 ([89cfa0c](https://10.1.2.7/visual-fe/swap-modules/commits/89cfa0c7281d6acd352129a025d29a66d5600895))


### BREAKING CHANGES

* 移除 singleSearchForm 参数，增加相关动态控件最大长度限制





# [0.8.0](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.7.0...@ty-one-start/one-start@0.8.0) (2022-01-13)


### Bug Fixes

* os-table 一次 debounce onChange 中可能触发多个字段修改 ([f299717](https://10.1.2.7/visual-fe/swap-modules/commits/f2997170a9c40bba76b708100c920c0499552bea))


### Features

* fieldItem title不设置时 lableCol 默认为 0 并且不展示冒号 ([eec7bed](https://10.1.2.7/visual-fe/swap-modules/commits/eec7bed63d1a291b0da835ba3c83251a155fcaa7))





# [0.7.0](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.6.0...@ty-one-start/one-start@0.7.0) (2022-01-13)


### Bug Fixes

* 表格搜索表单布局缺少对 singleSearchForm 的判断 ([0bfb656](https://10.1.2.7/visual-fe/swap-modules/commits/0bfb65686e48ec4b9e9355a27e36f3a59373b07e))
* os-grid 视图切换时，columns 应该是合并，而不是覆盖 ([db4af61](https://10.1.2.7/visual-fe/swap-modules/commits/db4af6192e609133efa64de62041ecff4d8771f3))


### Features

* os-form 支持 history 数据对比查看 ([d51bc6d](https://10.1.2.7/visual-fe/swap-modules/commits/d51bc6d43d57570a7d446090de7a77f23593942e))





# [0.6.0](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.5.2...@ty-one-start/one-start@0.6.0) (2022-01-07)


### Features

* 支持 os-table 的搜索表单的 layout inline 模式 ([38a1c23](https://10.1.2.7/visual-fe/swap-modules/commits/38a1c236bcbda62d019c0470e2bdbe23be848a26))





## [0.5.2](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.5.1...@ty-one-start/one-start@0.5.2) (2022-01-06)


### Bug Fixes

* 修复 os-dialog-modal-operate pop 和 push api 失效问题 ([9fde3c8](https://10.1.2.7/visual-fe/swap-modules/commits/9fde3c8635f72a55415f9d2cd493562a5076a583))





## [0.5.1](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.5.0...@ty-one-start/one-start@0.5.1) (2022-01-06)

**Note:** Version bump only for package @ty-one-start/one-start





# [0.5.0](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.4.2...@ty-one-start/one-start@0.5.0) (2022-01-06)


### Features

* 新增 os-actions-battle-table-upload 组件，支持批量样板文件上传预览 ([d305bae](https://10.1.2.7/visual-fe/swap-modules/commits/d305baebcd69bdc4e98b7c757eedf91aac817214))





## [0.4.2](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.4.1...@ty-one-start/one-start@0.4.2) (2022-01-04)


### Bug Fixes

* os-grid 树形数据分页的时，group 层数据 path 计算错误 ([13ae0da](https://10.1.2.7/visual-fe/swap-modules/commits/13ae0da8451fdc290e4c3bcd3fc1e2d802f53dd8))





## [0.4.1](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.4.0...@ty-one-start/one-start@0.4.1) (2022-01-04)

**Note:** Version bump only for package @ty-one-start/one-start





# [0.4.0](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.3.0...@ty-one-start/one-start@0.4.0) (2022-01-04)


### Features

* os-textarea 增加下层配置参数：showCount, maxLength ([794e7dc](https://10.1.2.7/visual-fe/swap-modules/commits/794e7dc37e98885e2ec2348833c2df9b7a0a5215))





# [0.3.0](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.2.4...@ty-one-start/one-start@0.3.0) (2022-01-04)


### Features

* os-table 支持前端分页下的搜索功能 ([c2db878](https://10.1.2.7/visual-fe/swap-modules/commits/c2db878167dbbba9fd70073385bb3989fb0e56d3))





## [0.2.4](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.2.3...@ty-one-start/one-start@0.2.4) (2021-12-24)


### Bug Fixes

* 修复错误包类型 ([6723dc5](https://10.1.2.7/visual-fe/swap-modules/commits/6723dc563d6e6d41dfaba22b5d6a660f17b5a810))





## [0.2.3](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.2.2...@ty-one-start/one-start@0.2.3) (2021-12-24)


### Performance Improvements

* 调整 form changeDebounceTimestamp 1000 -> 450 ([7b88de0](https://10.1.2.7/visual-fe/swap-modules/commits/7b88de0aa4948ad91d90b37b5bf7a2c0d292e9d9))





## [0.2.2](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.2.1...@ty-one-start/one-start@0.2.2) (2021-12-23)


### Bug Fixes

* 修复编辑表格输入 cache 失效 ([6e64b52](https://10.1.2.7/visual-fe/swap-modules/commits/6e64b5251126a308c98bd7174d7b14119c045e9b))





## [0.2.1](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.2.0...@ty-one-start/one-start@0.2.1) (2021-12-23)


### Bug Fixes

* 删除错误依赖 ([3d03bce](https://10.1.2.7/visual-fe/swap-modules/commits/3d03bcecc1dee2b5d8df6a10a34cce1f8f420994))





# [0.2.0](https://10.1.2.7/visual-fe/swap-modules/compare/@ty-one-start/one-start@0.1.0...@ty-one-start/one-start@0.2.0) (2021-12-23)


### Features

* 支持 form 嵌套的验证 ([0a00b7e](https://10.1.2.7/visual-fe/swap-modules/commits/0a00b7e30a7ef6ee0f732675a49fa41dad02bac3))





# 0.1.0 (2021-12-10)

**Note:** Version bump only for package @ty-one-start/one-start

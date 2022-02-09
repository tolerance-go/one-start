---
sidemenu: false
---

# 快速开始

- [服务器环境地址](http://confluence.tongyu.tech:8090/pages/viewpage.action?pageId=15413269)
- [基础设施更新日志](http://confluence.tongyu.tech:8090/pages/viewpage.action?pageId=15408055)
- 流程规范
  - [开发代码实践规范](http://confluence.tongyu.tech:8090/pages/viewpage.action?pageId=15408017)
  - [开发环境配置流程](http://confluence.tongyu.tech:8090/pages/viewpage.action?pageId=15408008)
  - [页面模块版本规范](http://confluence.tongyu.tech:8090/pages/viewpage.action?pageId=15408048)
  - [页面模块仓库开发流程](http://confluence.tongyu.tech:8090/pages/viewpage.action?pageId=15408019)

# 文件结构

## 仓库之间差异的配置

- packages/\*\* 业务模块代码
- settings.json 不同业务项目的 diff 都存放在这个文件中
- package.json 定义包名称，仓库地址，其他自动升级会覆盖，不要手动修改
- tsconfig.json 定义 paths 模块路径，其他不用修改

`*.write.js` 文件，在升级时将自定义覆盖逻辑，通过这种方式提供文件内容接口，比如 package.json 只暴露了 devDependencies，并且同名依赖优先保留升级内容，具体参考 [scaffolding-upgrade](http://10.1.2.7/Visual-FE/scaffolding-upgrade)

<!-- TODO: 定义通用 scripts 和 tsconfig 继承 -->

## 仓库之间通用的配置

- .configs.js 脚手架中不同工具间公共配置，都存放在这里
- .deployrc.js 静态文件发布配置
- .fatherrc.js npm 发布构建配置
- yarn.lock 自动生成的声明依赖的锁，不需要手动改
- mock 项目内部 openapi 自动生成的
- .yarn 模块本地压缩包
- .temp 本地临时文件
- .env 本地环境文件

目前互换，对客端和期权 3 个仓库暂时没有合并，因此以下模块会重复存在

- services-bct
- services-capital
- services-swap
- services-xxx
- core 主仓库中的 utils，不要修改它

## 注意事项

- 如果根目录 swagger-jsons 文件夹中存在对应 service 的 json 文件，默认将优先从本地生成请求代码，提交代码前保存一份最后的对接的 json 进去
- 使用到 openapi 的模块，在 index 文件中需要手动引入全局类型声明，否则构建 lib 阶段会报错

```ts
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../../services-swagger/src/__services__/typings.d.ts" />
/// <reference path="../../services-swap/src/__services__/typings.d.ts" />

import Page from './views';

export default Page;
```

- father build 无法使用 tsconfig 的 extend 功能
- mfsu 功能目前在 dumi 中存在性能问题，互换项目上发现了，需要等待观察

### 合约录入详情重构注意事项

1. 文件结构组织

```
memo

runtime

dom tree -> Button/Select

static

folder tree -> Button/Select | App->Page->Container->Component

common
```

2. 分布式的值联动写法

3. 属性联动写法及注意

4. 联动显示隐藏的写法

必须提供唯一的索引，哪怕是一个 hide 一个 show

5. 相同的 dataIndex？

6. form-field-item 的 group 必须提供唯一索引，默认为 title

7. 富 value 对象，select 和 money

8. getDataSource, setDataSource, getFieldsValue, setFieldsValue 的区别

9. 表格联动上报修改

<!-- 10. digit money -> BigNumber value type -->

### 实现注意

1. form resetFields 不会触发 form 的 onChange

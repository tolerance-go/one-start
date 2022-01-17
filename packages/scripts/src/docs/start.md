---
nav:
  title: scripts
  order: 3
  path: /scripts
order: 1
group:
  title: 构建打包
  path: /scripts/general
---

## 开发调试

`one-scripts` 下的 `build:watch` 命令，透传到了根目录中，所以我们可以直接在根目录下执行 `yarn start:scripts` 启动编译监听

此时，当我们修改 `src` 下的内容时候，会自行编译到 `es` 目录下

完成开发后，建议在 examples 下进行测试，比如我们直接 cd 进 `one-start/packages/scripts/examples/check-used-depends-must-in-pkg`，然后执行 `node ../../bin/prompts.js` 或者 `node ../../bin/yargs.js --help` 会看到对应的调试打印结果

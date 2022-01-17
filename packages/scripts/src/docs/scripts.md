---
nav:
  title: scripts
  order: 3
  path: /scripts
group:
  title: 构建打包
  path: /scripts/general
---

# 检查未使用依赖

交互式命令

```bash
$one-scripts // 选择“找到所有使用但是未声明的依赖”
```

纯命令行参数

```bash
$one-scripts:yargs check-used-depends-must-in-pkg --help

命令：
  yargs.js check-used-depends-must-in-pkg  检查使用但是未声明依赖

选项：
      --help     显示帮助信息                                             [布尔]
      --version  显示版本号                                               [布尔]
  -v, --verbose  打印额外信息，比如 debug 信息                              [布尔]
```

<embed src="../../CHANGELOG.md"></embed>

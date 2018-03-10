# 浪潮网页前端贡献指南

- [前言](#前言)
- [开发](#开发)
  - [开发环境](#开发环境)
  - [开始开发](#开始开发)
  - [分支](#分支)
- [提交 Pull Request](#提交-pull-request)

## 前言

浪潮是一个开放的社区，欢迎各位有心人士前来贡献代码，也欢迎加入我们的 Slack 群进行交流：

- [Slack](https://join.slack.com/t/v2land/shared_invite/enQtMzA4NTE1ODQzODU2LTMzNjMyZjdiYWU3OGQyZTI1YzA2ZTliNDBlMzY1MTA0N2RhYjBmZDJhNTY2N2IxMDdmMmJkNWY1NjcwZmY0NGQ)


## 开发

v2land-frontend 是浪潮项目的前端部分，主要基于 [Vue.js](http://cn.vuejs.org/) 和 [Nuxt.js](https://zh.nuxtjs.org/) 技术栈开发。

如果您想参与到 frontend 部分的开发当中，您可以做的事情有：

- 用代码实现我们设计好的 UI 图
- 和后端的 API 进行对接
- PWA
- 测试的编写
- 文档的改善

开发前，我们希望您可以加入我们的 [Slack](https://join.slack.com/t/v2land/shared_invite/enQtMzA4NTE1ODQzODU2LTMzNjMyZjdiYWU3OGQyZTI1YzA2ZTliNDBlMzY1MTA0N2RhYjBmZDJhNTY2N2IxMDdmMmJkNWY1NjcwZmY0NGQ) 群和我们充分沟通

### 开发环境

- Node.js 8.9 或以上
- Yarn 1.32 或以上

### 开始开发

开始开发前，您必须确保您已经 clone 下了代码到您的计算机，在安装完相关依赖后可以成功运行：

```sh
$ git clone https://github.com/v2land/v2land-frontend.git
$ cd v2land-frontend/
$ yarn install
$ yarn dev
```

### 分支

开发时，新分支的命名应该保持规范。大部分情况下，新分支应基于 `develop` 分支建立。

所有和 features 有关的分支以 feature 命名，如此类推：

- feature 相关 -> feature/xxx
- 测试相关 -> test/xxx
- 文档相关 -> doc/xxx
- API 对接相关 -> api/xxx
- 修复 bugs 相关 -> fix/xxx

## 提交 Pull Request

当您完成开发之后，您就可以给我们的 `develop` 分支提交 PR，我们感谢您的付出和支持。

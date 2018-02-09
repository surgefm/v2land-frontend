# 浪潮网页前端贡献指南

嗷！感谢使用本项目。

浪潮的成长离不开社区成员的协作，如果你愿意为浪潮贡献代码或提供建议，请阅读以下内容。

## Issue 规范
- Issue 仅用于提交 bug 或 feature 及设计相关的内容，其它内容可能会被直接关闭。

- 在提交 issue 之前，请搜索相关内容是否已被提出。

- 推荐使用 [JSFiddle](https://jsfiddle.net/) 生成在线 demo，这能够更直观地重现问题。

## Pull Request 规范
- 请先 fork 一份到自己的项目下，不要直接在仓库下建分支。

- Commit 信息要求简单明了，能说明改动的主要目的。

- 执行 `npm run build` 后可以正确打包文件。

- 提交 PR 前请 rebase，确保 commit 记录的整洁。

- 确保 PR 是提交到 `dev` 分支，而不是 `master` 分支。

- 如果是修复 bug，请在 PR 中给出描述信息。

## 代码规范
通过 ESLint 检测即可

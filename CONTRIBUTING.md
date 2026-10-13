# Contributing · 贡献与维护

## 中文

请通过 [Issues](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues) 或本仓库 PR 提交问题和修改。报告问题时提供 DSH 与浏览器版本、操作位置、复现步骤，以及使用设置控件是否正常；不附私人聊天或账户信息。

本仓库分发完整、可读的预构建 `lib/client.js`，没有原始拆分源码或构建工具。修改此文件需保持 DSH 共享 React 模块加载方式，不引入独立 React 副本或安装脚本。不修改用户的宿主配置，不自动重启 DSH。

提交前检查：

1. 运行 `node --check index.js` 和 `node --check lib/client.js`。
2. 用 `npm pack --dry-run --ignore-scripts` 核对包清单，确认 `dsh.bundle.patch`、宿主入口、客户端、README 和 LICENSE 均存在。
3. 实机验证聊天与输入区缩放、设置控件、Ctrl 快捷键、边界倍率、刷新恢复、倍率清除及禁用清理；同时确认侧栏/设置不缩放、模态弹窗与中文输入法不被抢占。注明未完成的场景，不用语法检查冒充实机验收。

新版本修改版本号并创建新 tag / Release，不移动既有 tag，也不替换已经发布的安装包。文档补充可以只更新 main；v0.1.0 原安装包保留发布时的 README，后补文档以 main 为准。

市场投稿只修改本插件单个 YAML 条目，不手改市场生成的 README，不动其他插件，详见 [市场投稿与合并说明](MARKET.md)。

## English

Use [Issues](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues) or a PR to report problems or changes. Include host/browser versions, affected area, reproduction steps and whether settings controls work. Do not share private chats or account data.

The readable prebuilt client is the maintained runtime in this repository; split sources and build tools are not shipped. Keep DSH's shared React loading. Do not add a separate React copy, install scripts, automatic host restarts or user configuration edits.

Before submitting:

1. Run `node --check index.js` and `node --check lib/client.js`.
2. Inspect `npm pack --dry-run --ignore-scripts` for the bundle patch, host entry, client, README and license.
3. Check scoped chat/composer zoom, settings, Ctrl gestures, limits, preference restore/clear and cleanup on a real host. Check unaffected sidebar/settings, modal dialogs and IME. State untested scenarios; syntax checks are not real-host acceptance.

Use a new version, tag and release for runtime changes. Do not move old tags or replace released packages. Documentation can be updated on main only; the original v0.1.0 archive retains its release-time README, while supplemental documents live on main.

Market PRs change only this plugin's entry and no generated market README or unrelated entries. See [market and merge notes](MARKET.md).

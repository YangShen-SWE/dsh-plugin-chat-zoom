# Contributing · 贡献与维护

## 中文

请通过 [Issues](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues) 或本仓库 PR 提交问题和修改。报告问题时提供 DSH 与浏览器版本、操作位置、复现步骤，以及使用设置控件是否正常；不附私人聊天或账户信息。

本仓库分发完整、可读的预构建 `lib/client.js`，没有原始拆分源码或构建工具。修改此文件需保持 DSH 共享 React 模块加载方式，不引入独立 React 副本或安装脚本。不修改用户的宿主配置，不自动重启 DSH。

提交前检查：

1. 运行 `node --check index.js`、`node --check lib/client.js`，以及 `node --test tests/chat-zoom.test.mjs`（Node.js 24，无额外依赖）。测试挂载模拟 DOM 中的真实控制器，不等于宿主实机验收。
2. 用 `npm pack --dry-run --ignore-scripts` 核对包清单，确认 `dsh.bundle.patch`、宿主入口、客户端、README、更新说明、补充文档和 LICENSE 均存在，测试文件不进入安装包。
3. 实机验证聊天与输入区缩放、设置控件、默认/自定义快捷键的保存/非法与重复校验/恢复、倍率与键盘配置独立清除、本地失败反馈、边界倍率、刷新恢复及禁用清理；同时确认侧栏/设置不缩放、模态弹窗与中文输入法不被抢占。注明未完成的场景，不用语法检查冒充实机验收。

有实质修改且检查通过后递增 `package.json` 的当前版本，并同步 `CHANGELOG.md`、必要的中英文使用说明。开发版本可以先提交 main；只有明确获得发布授权时才创建新 tag / Release，且不移动既有 tag 或替换已发布安装包。没有新 Release 时，下载与市场 tarball 继续指向旧的有效版本，不把开发功能说成已在旧包发布。v0.1.0 原安装包保留发布时的 README，后补文档以 main 为准。

市场投稿只修改本插件单个 YAML 条目，不手改市场生成的 README，不动其他插件，详见 [市场投稿与合并说明](MARKET.md)。

## English

Use [Issues](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues) or a PR to report problems or changes. Include host/browser versions, affected area, reproduction steps and whether settings controls work. Do not share private chats or account data.

The readable prebuilt client is the maintained runtime in this repository; split sources and build tools are not shipped. Keep DSH's shared React loading. Do not add a separate React copy, install scripts, automatic host restarts or user configuration edits.

Before submitting:

1. Run `node --check index.js`, `node --check lib/client.js`, and `node --test tests/chat-zoom.test.mjs` (Node.js 24, no extra dependencies). The tests mount the real controller in a simulated DOM, not a real DSH host.
2. Inspect `npm pack --dry-run --ignore-scripts` for the bundle patch, host entry, client, README, changelog, supplemental documents and license. Tests must stay outside the installation archive.
3. Check scoped chat/composer zoom, settings, default/custom binding save/validation/default reset, separate zoom/keyboard clearing, storage-failure feedback, limits, reload and cleanup on a real host. Check unaffected sidebar/settings, modal dialogs and IME. State untested scenarios; syntax checks are not real-host acceptance.

After meaningful changes and passing checks, increment the current `package.json` version and update `CHANGELOG.md` plus any affected bilingual usage instructions. Development versions may be committed to main before release. Create a new tag / Release only with explicit publishing authorization. Never move old tags or replace released packages. Without a new Release, keep downloads and the market tarball on the valid older version; do not claim development features are in that old package. The original v0.1.0 archive retains its release-time README; supplemental documents live on main.

Market PRs change only this plugin's entry and no generated market README or unrelated entries. See [market and merge notes](MARKET.md).

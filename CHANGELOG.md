# Changelog · 更新说明

## v0.1.2 — Unreleased / 未发布（2026-10-15，D2 下午）

### 中文

- **优化**：DSH 原生设置将局部作用范围、当前百分比、倍率范围分别呈现。主要调整控件与恢复/清除控件分组，使用主题颜色、原生控件和可换行布局，不增加依赖或假快捷键控件。
- **保持**：80%–200% 选项、10 个百分点步长、倍率选择/加减/恢复/清除的真实回调和边界禁用规则不变；不改变快捷键、滚轮、本地存储格式或隐私行为。
- **测试**：新增 5 项虚拟 React 树/模拟 DOM 设置测试，覆盖倍率显示与作用范围、分组、控件回调、边界、不可用状态、无虚假输入项及换行/焦点 CSS 规则。加上 D1 的 24 项，29 项全部通过；入口、客户端、测试文件语法检查通过。测试未使用真实 React DOM 渲染。
- **验证**：10 文件打包清单、版本/文档、相对链接与模块注册检查通过；测试文件不进入安装包。中英文 README 区分开发版与已发布包。
- **未测与交接**：未在 DSH 实机检查视觉、窄屏、Tab 顺序或屏幕阅读器；CSS 规则检查不证明真实布局已通过。晚间任务继续完善状态反馈、恢复/清除的说明及键盘可操作性，本次不提前宣称完成。
- **发布边界**：main 开发更新；没有创建 Release、部署或合并市场 PR。市场 tarball 保留真实存在的 v0.1.0，不包含本次布局更新。

### English

- **Improved:** native DSH settings separate scope, current percentage and range. Primary zoom controls and reset/clear controls are grouped, using theme colors, native controls and wrapping layout. No dependencies or placeholder shortcut fields.
- **Unchanged:** 80%–200% options, 10-point steps, real callbacks and boundary disabling. No shortcut, wheel, storage-format or privacy change.
- **Tests:** 5 new virtual-React-tree/simulated-DOM checks cover display/scope, groups, callbacks, limits, unsupported state, no fake inputs and wrap/focus CSS rules. All 29 tests, including D1's 24, pass; host/client/test syntax checks pass. No real React DOM renderer was used.
- **Validation:** the 10-file package list, version/docs, relative links and module registration checks pass. Tests stay outside installation archives. The bilingual README distinguishes development and released versions.
- **Not tested / handoff:** no real-host visual, narrow-screen, Tab-order or screen-reader acceptance. CSS assertions do not prove real layout. The evening task will address status feedback, reset/clear explanations and keyboard usability; these are not claimed complete here.
- **Release boundary:** main-only development update, no Release/deployment/market merge. The market keeps the existing v0.1.0 tarball, which does not contain this layout update.

## v0.1.1 — Unreleased / 未发布（2026-10-14）

### 中文

本节对应 main 的开发更新，不代表 GitHub Release 或市场安装包已升级。已发布下载与市场 tarball 暂时仍为 v0.1.0；不覆盖旧 tag 或资产。

- **修复**：键盘缩放只在输入区的文本编辑控件聚焦，或无控件焦点且鼠标悬停聊天区时响应。消息按钮、链接、发送按钮、文件输入、复选框、选择框等焦点不再被当作聊天文本焦点。
- **保持**：Ctrl 滚轮、设置倍率、80%–200% 边界、本地倍率键、输入法/模态/内嵌工具避让与停用清理不改变。不增加依赖、服务端行为或新配置项。
- **测试**：新增无依赖的 Node.js 事件回归测试，以模拟 DOM 挂载真实控制器并派发事件。在修改前，24 项中 8 项复现焦点抢占（按钮、链接、发送按钮、文件输入、复选框、选择框、消息容器、输入区容器）；修改后 24 项全部通过。另通过宿主入口、客户端及测试文件语法检查。
- **文档与打包**：中英文 README 区分开发版本与已发布包，澄清焦点边界并提供测试命令；贡献说明补充测试与发布授权边界；下一次打包包含本更新说明和 README 链接的补充文档，不包含测试或私密数据。
- **未实测**：本次没有安装或重启 DSH，未进行真实浏览器/物理键盘鼠标/中文输入法与阅读位置的实机验收。模拟测试不证明这些场景已通过。

### English

This is a main-branch development update, not a new GitHub Release or market package. Published downloads and the market tarball remain v0.1.0. Existing tags and assets are not replaced.

- **Fixed:** keyboard zoom requires a focused composer text editor, or idle focus with the pointer over the chat. Message buttons, links, send buttons, file inputs, checkboxes, selects and focusable containers no longer count as text-editor focus.
- **Unchanged:** Ctrl-wheel, settings controls, 80%–200% limits, the stored percentage key, IME/modal/embedded-tool exclusions and cleanup. No new dependencies, server behavior or configuration options.
- **Tests:** dependency-free Node.js checks mount the real controller in a simulated DOM and dispatch events. Before the fix, 8 of 24 cases reproduced interception (message button, link, send button, file input, checkbox, select, message container and composer container). After the fix, all 24 pass. Host entry, client and test syntax checks also pass.
- **Docs and packaging:** bilingual README explains the focus boundary and development-versus-release status; contribution guidance covers tests and release authorization. Future packages include this changelog and linked supplemental documents, but not tests or private data.
- **Not tested on a real host:** no DSH install/restart, physical keyboard/mouse, actual IME or reading-position acceptance was performed. Simulated checks do not prove those scenarios pass.

## v0.1.0 — 2026-10-13

首个 GitHub 发布：聊天消息与输入区局部缩放、原生设置、限定 Ctrl 操作、本地倍率记忆及短暂倍率提示。原始安装包与 tag 保持不变。

First GitHub release: scoped chat/composer zoom, native settings, scoped Ctrl gestures, local percentage storage and transient feedback. The original release archive and tag remain unchanged.

[Release v0.1.0](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/tag/v0.1.0)

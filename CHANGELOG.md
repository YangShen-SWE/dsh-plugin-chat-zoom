# Changelog · 更新说明

## v0.1.3 — Unreleased / 未发布（2026-10-15，D2 晚间）

### 中文

- **需求与实现**：完成设置剩余反馈，明确恢复与清除的区别，不增加假快捷键配置。设置有初始倍率状态、成功保存和保存/删除失败反馈；恢复/清除按钮关联区别说明，保留原生 Tab、选择框和按钮交互，无自定义键盘拦截、依赖或新设置。
- **修复**：清除记录后当前仍为 100% 时，“恢复 100%”此前提前返回，不会保存文档承诺的默认值。现在相同倍率也尝试保存并更新状态，允许保存失败后重试，避免残留“已清除”的过时反馈。
- **保持**：只缩放 DSH 聊天与输入区；键盘/滚轮作用范围、倍率边界和清理不变。倍率存储键与格式不变，只明确了同倍率恢复/调整时的保存时机；没有新增权限或网络行为。中英文 README 和隐私说明同步。
- **测试**：新增 5 项虚拟 React 树/模拟 DOM 测试，覆盖初始状态、恢复/清除/再次恢复、同倍率重试、存储失败及重试、描述关联与原生键盘不拦截。全部 34 项通过；入口、客户端与测试语法检查通过。
- **验证**：10 文件打包清单、模块注册、版本和文档相对链接通过检查；测试不进入安装包。
- **未测与限制**：没有在真实 DSH 验收视觉、Tab 顺序、浏览器选择框、物理输入或屏幕阅读器；虚拟树检查不证明真实播报。没有新增 DOM 兼容检测或快捷键自定义。本日两个开发任务到此结束。
- **发布与市场**：仅 main 开发更新，无 Release、部署、旧 tag/包改写或自动合并。市场继续使用有效的 v0.1.0 tarball，不含本次开发更新。

### English

- **Requirement and implementation:** complete settings feedback and distinguish reset from clear, without placeholder shortcut controls. Settings show initial level, save success and save/removal failures. Reset/clear reference explanatory text. Native Tab/select/button interaction remains; no new key handler, dependency or setting.
- **Fixed:** after clearing the record while at 100%, reset previously returned early without saving the documented default. Same-level actions now attempt saving and refresh status, allowing retries and replacing stale cleared messages.
- **Unchanged:** DSH chat/composer-only scope, keyboard/wheel eligibility, limits and cleanup. Storage key/format stay the same; only same-level save timing is clarified. No added permissions or networking. Bilingual README and privacy notes are updated.
- **Tests:** 5 new virtual-React-tree/simulated-DOM tests cover initial status, reset/clear/reset, same-level retry, blocked storage/recovery, linked descriptions and unclaimed native keys. All 34 tests and host/client/test syntax checks pass.
- **Validation:** 10-file package list, module registration, version and relative documentation links checked. Tests stay outside installation archives.
- **Not tested / limits:** no real DSH visual, Tab-order, browser-select, physical-input or screen-reader acceptance; virtual trees do not prove actual announcements. No new DOM compatibility detection or custom shortcut feature. This completes today's two development tasks.
- **Release and market:** main-only update; no Release, deployment, old-tag/asset rewrite or auto-merge. Market installation remains on the valid v0.1.0 tarball, without these development changes.

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

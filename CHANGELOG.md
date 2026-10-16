# Changelog · 更新说明

## v0.2.1 — Unreleased / 未发布（2026-10-16，市场展示资料）

### 中文

- **需求**：为原市场 PR 补充可直接展示的双语短简介及示例图片，便于上架后的详情页展示，不重复投稿。
- **实现**：新增两个已发布 v0.1.0 的隔离浏览器演示图（150% / 100%），在根目录 `screenshots.json` 声明顺序，README 内展示并注明来源。使用校验过 SHA-256 的原始发布包与合成 DOM/示例内容，由 Chrome 155 无头模式运行未修改客户端后截图；所有图片明确标注“非 DSH 实机截图”，不展示未发布快捷键能力。精简原市场 YAML 双语描述；不编辑市场生成数据或其他条目。
- **版本与验证**：展示/文档更新从 0.2.0 递增 PATCH 为 0.2.1，运行时代码与本地存储行为不变。52 项模拟测试、语法、模块/相对文档链接、图片签名/尺寸、声明路径及 13 文件 dry-run 包清单检查通过；已目视核对两张图。浏览器隔离演示不等于 DSH 宿主、物理输入、IME 或读屏验收。仍无新 Release，市场继续使用原 v0.1.0 包。

### English

- Added a short bilingual market description and two storefront demo images (150% / 100%), declared in root `screenshots.json` and shown in the README. Updated only this plugin's existing market entry/PR.
- Images use the unchanged, SHA-256-verified v0.1.0 release client inside synthetic sample DOM/content, rendered by headless Chrome 155. Each image is visibly labelled an isolated demo, **not a DSH-host screenshot**. No unreleased shortcut UI is advertised. No runtime/storage changes; this documentation/media update increments PATCH from 0.2.0 to 0.2.1.
- 52 simulated tests, syntax, shared module/docs links, PNG signature/dimensions, declaration paths and the 13-file dry-run package check pass; both images were visually checked. Isolated rendering is not real DSH, physical-input, IME or screen-reader acceptance. No new release or old archive change; the market still installs v0.1.0.

## v0.2.0 — Unreleased / 未发布（2026-10-16，D3 接线，提前执行）

### 中文

- **需求与实现**：将 v0.1.4 模型接入真实控制器、严格聊天焦点事件和原生设置表单。放大/缩小/复位支持单次组合（Ctrl/Alt/Shift/Meta 或 F2/F8/F9），可输入、校验、保存及恢复默认；未保存的输入不生效，错误不会覆盖当前配置。默认 Ctrl+Plus / Ctrl+Minus / Ctrl+0 保持兼容，小键盘及 Plus/Minus Shift 别名不产生重复。完整新能力按当前版本从 0.1.4 递增 MINOR 为 0.2.0。
- **存储与隔离**：只用当前来源的 `dsh-plugin-chat-zoom:v1:keyboard` 保存版本号和三条绑定，独立于原倍率键。缺失/无效/未来格式回退默认而不自动改写；保存或删除失败明确标注仅本页生效。恢复默认快捷键不改倍率，清除倍率不改快捷键。不新增网络、依赖或权限；不改变轮滚 Ctrl 规则，不接管普通文字/编辑键、IME、AltGraph、弹窗或消息控件焦点。
- **使用与限制**：设置 → 缩放 → 键盘快捷键，例如 Alt+J / Alt+K / F9，点击“保存快捷键”。Plus/Minus 的 Shift 被归一化；只支持文档列出的主键，拒绝常见浏览器/编辑保留组合。不能枚举或覆盖所有 OS/宿主冲突；宿主先截获时换绑定或用倍率控件。不会修改宿主保留键，也不扩大到全局缩放。
- **验证**：52/52 Node 模拟 DOM/虚拟 React/配置测试通过，含 12 项新事件、设置保存/校验、恢复、旧存储与写入失败测试；宿主/客户端语法、共享模块、双语文档链接、10 文件 dry-run 清单通过。曾发现旧测试假设所有按钮均为 type=button，已改为只允许真实表单保存按钮 submit，其余保持 button。真实 DSH 布局、物理键盘、系统/宿主快捷键、IME 与读屏未验收。未创建 Release、改旧 tag/包或替换市场 tarball。

### English

- Wired the v0.1.4 model into the controller, scoped key events and native settings form. Edit, validate, save or restore three single chords using Ctrl/Alt/Shift/Meta or unmodified F2/F8/F9. Drafts stay inactive; invalid input leaves active/stored bindings intact. Defaults and numpad/symbol aliases remain compatible. This completed user-facing capability increments 0.1.4 to minor version 0.2.0.
- Store only the schema version and three binding strings in origin-local `dsh-plugin-chat-zoom:v1:keyboard`, independent of the unchanged percentage key. Missing/invalid/future records default without silent writes. Failed writes/removals explicitly report session-only changes. Reset shortcuts preserves the level; clear zoom preserves shortcuts. No network, dependencies, permissions, wheel changes or wider focus capture.
- In Settings → 缩放 → 键盘快捷键, try Alt+J / Alt+K / F9 and save. Plus/Minus Shift aliases normalize to one chord. Only documented keys are accepted; common reserved editing/browser chords are rejected. OS/host conflicts cannot all be detected or overridden: choose another chord or use level controls. IME, AltGraph, dialogs and focused chat controls are excluded.
- 52/52 simulated Node tests, both syntax checks, module/metadata/bilingual-link checks and the 10-file dry-run package check pass. An old all-buttons-are-button assertion was updated to allow only the real form's save button to submit. Real DSH layout, physical keys, OS/host conflicts, IME and screen readers are not verified. No release, old tag/archive change or market tarball replacement.

## v0.1.4 — Unreleased / 未发布（2026-10-16，D3 配置基础，提前执行）

### 中文

- **需求与实现**：新增无依赖的三动作单次快捷键配置模型、别名/修饰键顺序归一化、重复与危险绑定校验，以及独立本地存储的读写/恢复默认基础。Plus/Minus 的 Shift 别名视为同一绑定，避免重叠。无修饰键仅接受 F2/F8/F9，拒绝文字编辑键、连续序列和常见保留组合。
- **交接与边界**：本次仅准备纯函数，未接入运行时读取、事件或设置 UI；现有 Ctrl 操作不变，不宣称自定义快捷键已经可用。下一部分须接线并新增事件/UI/存储失败测试后才交付新能力。旧倍率键不变；旧用户无需转换，缺失/无效/未来版本的配置回退默认，不自动改写存储。
- **验证**：40/40 Node 轻量测试通过（含 6 项新配置/存储测试），宿主与客户端语法通过；无 DSH 实机、物理键盘/IME或浏览器保留键验证。没有创建 Release、更改既有 tag/安装包或市场 tarball。

### English

- Added a dependency-free, versioned three-action keyboard model, alias/modifier normalization, duplicate/reserved-key validation and local read/write/reset helpers. Shift aliases for Plus/Minus cannot overlap. Only F2/F8/F9 may be unmodified; text/editing keys, sequences and common reserved chords are rejected.
- Foundation only: runtime reads, events and settings are not wired yet. Existing Ctrl gestures are unchanged. The next step must integrate and test the feature before claiming custom shortcuts work. The old percentage key stays intact; missing, invalid or future records default without silent writes.
- 40/40 simulated Node tests and both syntax checks pass. Real DSH, physical keyboard/IME and browser shortcut behavior remain untested. No release, old tag/archive replacement or market tarball change.

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

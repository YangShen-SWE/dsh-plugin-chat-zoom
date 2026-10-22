# Validation record · 脱敏验收记录

## 2026-10-22 · D7 补执行 · main v0.3.3（未发布 / unreleased）

**中文**：D7 原定 10 月 20 日，本日补执行。周交付已在 README 汇总；D1 焦点、D2 设置/反馈、D3 键盘、D4 滚轮、D5 符号修复与模拟回归、D6 文档均为源码交付，不是新发布包。本次无运行时修改。完整现有 80 项检查和语法/模块/链接检查通过；另用 npm pack --ignore-scripts 生成真实 tgz，验证 gzip/tar、归档路径、恰好 14 个文件及每个文件与当前工作树字节一致。包只留工作区诊断目录，不提交，不上传 Release，不安装宿主。

**English:** D7 was scheduled for October 20 and completed today. README summarizes source-only deliveries: D1 focus, D2 settings/feedback, D3 keyboard, D4 wheel, D5 symbol fix/simulation and D6 documentation. No runtime edits in D7. All 80 existing checks and syntax/module/link checks pass. A real npm pack --ignore-scripts archive passes gzip/tar/path checks and contains exactly 14 files, each byte-identical to its working-tree source. Keep it only in local diagnostics, not Git, Releases or the installed host.

**发布待确认 / Release pending**：指定 DSH/浏览器的实机视觉隔离、长聊天/异步图片、80%/200% 编辑与发送、物理键鼠/触控板、IME、原生键盘导航/读屏、停用重启依旧未测。需补实际结果、单独发布授权及真实新资产后才能升级市场。Real-host/physical-input gaps below remain open; passing archive tests is not release approval. PR #7323 is merged; retain the valid v0.1.0 market URL.

## 2026-10-19 · D6 · main v0.3.2（未发布 / unreleased）

**中文**：按真实实现整理中英文设置、默认/自定义键盘、独立滚轮、恢复/清除与隐私记录；旧 v0.1.0 焦点/滚轮规则与 main 分开说明。仅改客户端维护注释，不改变可执行逻辑。新增 5 项文档契约检查：版本、实际存储键/默认 JSON、范围/示例绑定、相对链接/包引用与维护入口。新增检查首次 3/5 通过，缺口为缺少双语可校验记录示例与过时生成器注释；补齐后连同原 75 项模拟回归共 80/80 通过。语法、共享 React 注册及 14 文件 dry-run 包清单通过；未引入依赖/工具链，测试不入包。市场 PR #7323 已合并，规则内容未变；原 v0.1.0 资产重新下载并核对 SHA-256，保持有效且不替换。没有新增实机证据：下面 D5 表格中的宿主、视觉、物理输入、IME 与读屏未测项仍然未测。无 Release、部署或合并操作。

**English:** aligned current bilingual usage, defaults/custom keys, independent wheels, reset/clear and privacy records with the implementation; distinguished v0.1.0's broader focus/wheel rules. Client edits are comments only, with no executable change. Added 5 dependency-free documentation contracts covering versions, actual keys/default JSON, limits/example bindings, local links/package references and maintenance entry points. Initially 3/5 passed: decoded bilingual examples and truthful maintenance comments were missing. After fixes, all 80 checks pass including the original 75 simulations. Syntax, shared React registration and the 14-file dry-run package pass; no new toolchain/dependency and tests remain outside packages. Market PR #7323 is merged with unchanged policy content; the original v0.1.0 asset was downloaded and SHA-256 verified without replacement. No new real-host evidence: D5's host/visual/physical-input/IME/screen-reader gaps below remain untested. No Release, deployment or merge action.

## 2026-10-18 · D5 · main v0.3.1（未发布 / unreleased）

### 中文

**对象与环境**：基于 v0.3.0 的本周实现，在 Windows / Node.js 24.19.0 中加载真实客户端控制器，使用无依赖 `node:test`、模拟 DOM/事件/计时器/动画帧/MutationObserver 和虚拟 React 树。内容、选择器树与坐标均为合成数据；没有个人聊天、账号或配置。本记录不等于 DSH 宿主验收或浏览器布局测试。

| 需求 | 结果与证据 | 未覆盖边界 |
| --- | --- | --- |
| 80%–200% 边界、复位、设置接线 | 现有边界、倍率选项、控制器按钮/选择回调测试通过 | 真实浏览器控件交互与视觉 |
| 默认/自定义键盘、精确修饰键、焦点 | 现有事件/配置测试与新增物理 Minus 的 Shift 别名测试通过；消息按钮、链接、侧栏、设置、工具焦点不接管 | 物理键盘布局、OS/宿主先截获 |
| Ctrl/Alt/Shift/Meta 滚轮 | 四选一、普通/额外修饰不接管、90ms 节流/反向、边界和独立恢复通过 | 物理滚轮、触控板、捏合 |
| 倍率/键盘/滚轮独立保存、清除与旧数据 | 旧整数倍率直接读回；异常/未来记录不覆写；独立恢复、失败反馈、重挂载测试通过；无迁移 | 实际来源权限、跨进程宿主行为 |
| IME/AltGraph/弹窗避让 | 合成 composition、229、AltGraph、可见 modal 与已处理/不可取消事件通过 | 真实中文输入法与系统弹窗 |
| 提示与多面板 | 最后操作后 5000ms 隐藏、旧期限不打断续期、共享倍率、单一 status 播报节点通过 | 实际绘制、读屏播报 |
| 区域发现与侧栏/设置隔离 | hero、无支持区域、隐藏和返回聊天、只标记消息/输入区通过；不回退全页 | 实际宿主 DOM 与所有视觉隔离 |
| 停用清理 | 重复 dispose、监听/观察器/定时器/帧取消、提示/样式/标记释放、外部所有权保留通过 | DSH 插件管理器的实际停用/重启 |
| 阅读位置 | 合成锚点前后偏移、下一帧修正、底部跟随与无锚点中段计算通过 | 长聊天重排、异步图片/代码布局、真实 CSS zoom |
| 草稿编辑与发送 | 未测；未改动宿主与草稿数据 | 高倍率编辑、发送、焦点和光标 |

**复现与修复**：新增测试初次 73/75 通过。确认为运行时问题的只有 Shift+物理 Minus 产生 `_` 与已声明 Minus 别名不一致。运行时仅增加精确的两行条件与注释；额外下划线键位/无 Ctrl 默认手势仍不接管。另一处锚点失败是模拟几何未随滚动更新，修正模拟器即可，不改滚动算法。随后 75/75 通过。

**命令与范围**：`node --test tests/chat-zoom.test.mjs`；`node --check index.js`、`node --check lib/client.js`、`node --check tests/chat-zoom.test.mjs`；`npm pack --dry-run --ignore-scripts --json`。另检查模块注册只请求宿主共享 React、bundle/exports 与文档链接、14 文件包清单（无测试或个人文件）。这些检查不证明真实 DSH 可用；需要宿主实机后补表中未测项。

**发布与市场**：本次只提交/推送 main 开发版本，无 Release、部署、宿主安装或旧包替换。PR #7323 已合并、两项检查成功；贡献指南内容 SHA 与此前相同。市场仍用原 v0.1.0 tarball，不重复投稿。存储与隐私行为无变化。

### English

**Environment:** Windows / Node.js 24.19.0, real client controller with dependency-free node:test, synthetic DOM/events/timers/frames/observer and a virtual React tree. All content and coordinates are synthetic. No personal chats/accounts/configuration. This is not real DSH or browser-layout acceptance.

**Passed in simulation:** limits/settings callbacks; default/custom key chords, exact modifiers and excluded focus; four wheel modifiers/throttle/reversal/limits; independent storage/reset/clear and blocked-storage feedback; legacy level reads without migration/overwrite; IME/AltGraph/modal flags; five-second hint renewal; multi-panel shared level/one live status; hero/hidden/return discovery; disposal of listeners/observer/timers/frames/styles/markers and external ownership; synthetic anchor/tail arithmetic.

**Reproduction:** initially 73/75 new-plus-existing checks passed. One runtime gap was confirmed: Shift+physical Minus produced `_` and missed the documented Minus alias. Add only the precise key/code/Shift normalization; other underscore keys and unmodified default gestures remain unclaimed. The other failure came from synthetic viewport coordinates not following scrolling; fix the test model, not the runtime scroll algorithm. All 75 then pass.

**Still untested:** actual DSH/browser DOM/layout and visual sidebar/settings isolation, long chats with asynchronously loaded images/code, high-zoom draft editing/sending/cursor behavior, physical keyboard/wheel/trackpad, OS shortcuts, real IME, plugin-manager disable/restart, native control navigation and screen readers. No replacement server was started and no host was changed.

**Other checks:** host/client/test syntax, shared-React-only registration, bundle/exports, relative documentation links and the exact 14-file dry-run package manifest pass. Tests/personal files are excluded. Run the node test, syntax and npm dry-run commands above to reproduce; passing them does not establish real-host usability.

**Release boundary:** commit/push development main only. No release/deployment/install/old-asset change. Merged market PR #7323 has successful checks and unchanged contribution-guide content; retain the valid v0.1.0 tarball without resubmission. Storage/privacy behavior is unchanged.

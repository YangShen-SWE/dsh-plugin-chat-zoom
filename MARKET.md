# Market submission & merge notes · 市场投稿与合并注意事项

## 中文

目标市场：[awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)。本账号 Simple Desktop Pet 的 [PR #6267](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/6267) 已于 2026-10-13 合并。缩放插件需要独立投稿；桌宠已收录不表示本插件也已收录。

本次投稿：[Chat Zoom PR #7323](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/7323)。投稿只表示已提交；请在原 PR 页面查看实际检查、评审和合并状态。

规则来源：[贡献指南](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md)、[PR 模板](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/.github/pull_request_template.md)及 [Submission gate 实现](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/scripts/check-submission.mjs)。规则可能更新，维护时重新核对。

### 本次投稿范围

- 仅新增 `data/plugins/YangShen-SWE__dsh-plugin-chat-zoom.yml`，分类为 `ui`；仓库和名称均指向 `YangShen-SWE/dsh-plugin-chat-zoom`。
- 不修改市场自动生成的 README、其他插件条目或市场 CI。隐私、维护与投稿文档放在本插件仓库。
- 插件已声明 `dsh.bundle` 并附带 `cordis.patch.yml`，不只是声明 `dsh.client`；仓库需有 `dsh-plugin` topic。
- 使用固定版本的预构建包链接：`https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/download/v0.1.0/dsh-plugin-chat-zoom-0.1.0.tgz`。不将带版本的资产名接在 `latest/download/` 后，避免下次发布后出现 404。
- 原 v0.1.0 tag、发布包内的运行时代码与资产不重写。SHA-256：`908b0eca7bf91b4528a125f29b05a0590901ee29ad3fcb98f7afddb381510222`。main 的后补文档不冒充已包含在既有发布包中。

2026-10-14：main 开发版本已更新为 v0.1.1，修正键盘焦点范围，**尚未发布新安装包**。市场条目仍保留有效的 v0.1.0 tarball 和对应功能描述；本次不将下载指向不存在的 v0.1.1 资产，不重复投稿或触发合并。具体修正及模拟测试限制见 [更新说明](CHANGELOG.md)。

2026-10-16：main 已完成自定义键盘组合并递增为 **v0.2.0（未发布）**，支持设置保存、恢复默认及独立本地键盘配置，默认和 Ctrl 滚轮保持兼容。市场 v0.1.0 tarball 未包含这些变化；在真实新包发布前，不修改其版本/描述以冒充已可安装，不新增重复 PR。验证范围和未验实机场景见 [更新说明](CHANGELOG.md)。

2026-10-16 展示资料补充：main 仅因文档/图片递增为 **v0.2.1（未发布）**，运行时代码不变。原市场 YAML 已精简双语简介；插件根目录 [screenshots.json](screenshots.json) 声明两张 v0.1.0 隔离演示图，README 与原 PR 附图均明确标注“非 DSH 实机截图”。图片仅使用合成内容和原始发布客户端，不展示未发布设置。遵循市场指南，不给其旧 `data/screenshots.json` 添加键；合并及采集完成后才可能显示，不能保证立即展示。

### 仓库年龄门槛

GitHub 仓库创建于 **2026-10-13 18:44:31 UTC**。满一天的最早时间为 **2026-10-14 18:44:31 UTC**（丹麦当地时间 20:44:31，UTC+02:00）。提交时尚未满一天，PR 不应勾选“已满一天”。

当前 gate 根据检查时的仓库年龄判断，并明确说明：如果只因年龄失败，不必重投、关闭重开、推空提交或修改日期。上游的 [定期重检流程](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/.github/workflows/regate.yml) 可以重跑符合条件的开放 PR，但存在队列和冷却期，满一天不表示检查会立刻变绿。若未自动恢复，请在原 PR 请求维护者正常重检，不绕过 gate。

### 与已有缩放条目的区别

市场已有 [`Centaurea5547196/dsh-page-zoom`](https://github.com/Centaurea5547196/dsh-page-zoom)，条目声明缩放整个界面；[`Physicolor/dsh-ui-harmonizer`](https://github.com/Physicolor/dsh-ui-harmonizer) 的条目包含工作区缩放及更广的界面协调。本插件聚焦**仅聊天消息与输入区**：侧栏与设置不缩放，倍率通过原生设置分区或限定范围的 Ctrl 手势调整，提示只短暂出现。以上比较依据市场条目，未声称已独立审计其他项目。是否构成有价值的独立条目由市场维护者决定，不修改或贬低既有条目。

### 合并前检查

1. 核对 PR 最新 head 的 `check` 与 `Submission gate`，不是旧提交的绿灯；待仓库满一天且 gate 通过。
2. 核对 PR 仅新增本插件一个 YAML，路径恰好一层、扩展名为 `.yml`，不存在旧 fork 引入的删除或他人改动。
3. 核对下载链接有效、资产校验和一致、描述与代码相符、manifest/patch 可解析。不得把语法、纯逻辑或包完整性检查说成所有设备与鼠标/IME 实机验收；缺少实机截图时不伪造截图。
4. CI 通过只是前置条件，仍需维护者阅读代码、核对分类与差异并批准。投稿、发布、CI 成功均不等于已收录。
5. 仅由有权限的维护者按仓库策略正常合并；不使用管理员绕过、强制合并、未经授权的 auto-merge 或重复催促。收到修改意见时修正原分支，不新开重复 PR。

## English

Target: [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin). Simple Desktop Pet [PR #6267](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/6267) was merged on 2026-10-13. That does not list Chat Zoom automatically.

Submission: [Chat Zoom PR #7323](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/7323). Check that PR for the actual CI, review and merge state; submission alone does not mean admission.

Follow the upstream [contribution guide](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md) and [PR template](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/.github/pull_request_template.md). Add only `data/plugins/YangShen-SWE__dsh-plugin-chat-zoom.yml` under `ui`; do not change generated market READMEs, CI or unrelated entries. Keep supplemental documents in this repository. The package declares `dsh.bundle`, includes its patch, and the repository needs the `dsh-plugin` topic.

The tarball URL pins v0.1.0. A versioned filename must not be used under `latest/download/`. Do not move the existing tag or replace its asset. SHA-256: `908b0eca7bf91b4528a125f29b05a0590901ee29ad3fcb98f7afddb381510222`. Additional main-branch documentation is not claimed to be inside the original archive.

2026-10-14: main is now development version v0.1.1 with a keyboard-focus fix; **no new package has been released**. Keep the valid v0.1.0 market tarball and matching feature description. Do not point to a nonexistent v0.1.1 asset, resubmit, or trigger a merge. See the [changelog](CHANGELOG.md) for the fix and simulated-test limitations.

2026-10-16: main now completes custom keyboard chords as **v0.2.0 (unreleased)**, including settings save/default reset and separate local keyboard preferences. Default keyboard and Ctrl wheel remain compatible. The market's v0.1.0 archive does not contain these changes: do not advertise an installable upgrade or open a duplicate PR before a real new release. See the [changelog](CHANGELOG.md) for test scope and unverified real-host cases.

2026-10-16 media follow-up: main increments only for documentation/media to **v0.2.1 (unreleased)**, with no runtime change. The existing market YAML has a shorter bilingual description. Root [screenshots.json](screenshots.json), the README and the original PR reference two released-v0.1.0 isolated demos, visibly labelled **not DSH-host screenshots**. They use synthetic content and the original release client, not unreleased settings. Do not add keys to the market's legacy screenshot file. Storefront display depends on merging and collection, not an immediate guarantee.

**Age gate:** created 2026-10-13 18:44:31 UTC; eligible no earlier than 2026-10-14 18:44:31 UTC (20:44:31 in Denmark). Do not tick the one-day checkbox before that time. The current checker measures age when it runs; age-only failures can be rechecked upstream. No duplicate PR, close/reopen, empty push, fake date or gate bypass is needed. Scheduled rechecks have a queue and cooldown; eligibility does not guarantee an immediate green result.

**Scope difference:** the existing page-zoom listing scales the whole interface; the harmonizer listing offers workspace zoom and broader UI coordination. Chat Zoom focuses on chat messages and the composer, leaving sidebar/settings scale unchanged, with scoped Ctrl gestures, a native settings section and transient hints. These comparisons use catalog descriptions, not independent audits of those projects. Maintainers decide whether the entry is distinct enough.

**Before merge:** verify the latest head's `check` and `Submission gate`; inspect the exact single-file diff; confirm the package URL, hash and manifest; check claims against code. Syntax/core/package checks do not prove all real-device mouse, host or IME scenarios. Do not fabricate screenshots. Green CI is a prerequisite, not approval or admission. An authorized maintainer must review and merge under normal policy; no admin bypass, force merge, unauthorized auto-merge or repeated reminders. Address feedback on the same branch.

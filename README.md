# DSH Chat Zoom · 缩放

**中文** | [English](#english)

DeepSeek Harness（DSH）聊天区域缩放插件。仅缩放聊天消息和输入区，不改变侧栏、设置页或全局弹窗。

- 插件名称：**缩放**
- 软件包 / 仓库名称：`dsh-plugin-chat-zoom`
- 首个 GitHub 发布版本：**v0.1.0**
- 许可证：[MIT](LICENSE)

[下载 v0.1.0](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/tag/v0.1.0) · [报告问题](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues)

补充文档：[更新说明](CHANGELOG.md) · [隐私说明](PRIVACY.md) · [贡献与维护](CONTRIBUTING.md) · [市场投稿与合并注意事项](MARKET.md)。这些文档后补于 main；既有 v0.1.0 安装包与 tag 保持不变。市场投稿不等于已收录。

**当前 main 开发版本：v0.1.1（尚未发布安装包）**。键盘焦点范围修正仅包含在当前源码中；下方下载和市场条目仍指向已发布的 v0.1.0，不包含本次修正。

## 功能

- 文字、代码、图片和输入控件一起进行布局缩放。
- 默认 **100%**，范围 **80%–200%**；快捷键和放大 / 缩小按钮每次调整 **10 个百分点**。
- 在设置页选择倍率、放大、缩小、恢复默认或清除倍率记忆。
- 操作后显示倍率提示，最后一次操作 **5 秒**后自动隐藏；聊天区没有常驻缩放工具栏。
- 同一页面的聊天面板共用倍率；按浏览器的网站来源保存偏好，刷新后可恢复。
- 尽量保留当前阅读位置，不强制跳到聊天顶部或底部。

## 运行要求

这是 **DSH 插件**，不是 Chrome / Edge 扩展，也不是可独立运行的网站。

需要提供客户端模块加载器、React 共享模块和 `settings.section` 插槽的 DSH，以及支持 CSS `zoom` 的浏览器。适配依据为 **DSH 0.2.0-rc.2** 的内部聊天 DOM 属性；不保证其他宿主版本兼容。`v0.1.0` 是本插件的版本，不是 DSH 的版本。

发布包已包含可运行的客户端文件，**无需自行构建或安装独立 React**。插件界面目前使用中文；本文档提供中英双语说明。

## 安装

### 方法一：在 DSH 插件页安装（推荐）

1. 在 [v0.1.0 发布页](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/tag/v0.1.0) 下载 **`dsh-plugin-chat-zoom-0.1.0.tgz`**。不要把 GitHub 自动生成的源码 ZIP 当作插件安装包。
2. 打开 DSH 侧边栏的 **插件** 页面，进入安装外部插件 / 组合包的入口。
3. 将下载文件的**完整绝对路径**作为安装来源，例如：`C:/Downloads/dsh-plugin-chat-zoom-0.1.0.tgz`。这里的路径只是示例，请换成实际下载位置。该路径必须能被运行 DSH 的电脑访问；远程浏览器本地的文件不一定对 DSH 主机可见。
4. 确认安装，并检查 `dsh-plugin-chat-zoom` 已启用。若入口支持 HTTP(S) 压缩包来源，也可直接填写下方下载地址。
5. 刷新 DSH 页面，再打开 **设置 → 缩放**。如果仍不出现，请完整退出并重启 DSH，而不是只关闭网页。

安装包直链：

```text
https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/download/v0.1.0/dsh-plugin-chat-zoom-0.1.0.tgz
```

### 方法二：使用 DSH CLI

如果已配置 `dsh` 命令，桌面版可运行：

```sh
dsh plugin --profile desktop add "dsh-plugin-chat-zoom@https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/download/v0.1.0/dsh-plugin-chat-zoom-0.1.0.tgz" --ignore-scripts
```

离线安装已下载的文件，例如在 Windows 上：

```sh
dsh plugin --profile desktop add "dsh-plugin-chat-zoom@file:C:/Downloads/dsh-plugin-chat-zoom-0.1.0.tgz" --offline --ignore-scripts
```

请把文件路径和 `desktop` 替换为实际下载位置与当前 profile（配置档案）。不确定 profile 或没有 `dsh` 命令时，使用插件页安装。**这些命令由用户执行，本仓库不会自动修改 DSH 配置。** 插件自身没有安装脚本。

### 方法三：安装仓库目录

也可下载并解压 GitHub 源码，或克隆仓库，然后在 DSH 插件页将**包含 `package.json` 的目录绝对路径**作为安装来源。不要直接选择 `lib` 子目录。

## 使用

### 设置页

进入 **设置 → 缩放**：

| 控件 | 作用 |
| --- | --- |
| 聊天倍率 | 选择 80%–200% 的倍率 |
| 缩小 / 放大 | 每次调整 10 个百分点 |
| 恢复 100% | 恢复默认倍率，并保存该值 |
| 清除倍率记忆 | 恢复 100%，删除本插件保存的倍率记录 |

修改立即生效。清除倍率记忆不会删除聊天、输入草稿或其他设置。

### 快捷键

| 操作 | 效果 | 使用位置 |
| --- | --- | --- |
| `Ctrl` + 滚轮向上 / 向下 | 放大 / 缩小 | 鼠标位于聊天消息或输入区 |
| `Ctrl` + `+` / `-` | 放大 / 缩小 | 输入区有焦点；或没有其他控件焦点且鼠标悬停聊天区 |
| `Ctrl` + `0` | 恢复 100% | 与上述键盘快捷键相同 |

加号支持 `Ctrl` + `=`、`Ctrl` + `Shift` + `=`；也支持小键盘加减号。普通滚轮与 `Ctrl+C/V/Z` 等编辑快捷键不会被接管。

从 main 的 v0.1.1 起，“输入区有焦点”仅指输入区内的多行文本框、文本输入框或可编辑文字区域。消息按钮、链接、发送按钮、文件选择、复选框、选择框等获得焦点时，不接管这些键盘缩放操作，即使鼠标仍在聊天区。无控件焦点时，必须仍悬停聊天区才响应。滚轮与设置控件的规则不变；插件不接管不代表浏览器或宿主也会忽略按键。

## 隐私与卸载

插件自身不发送网络请求、不上传聊天、不收集遥测，不写入服务端设置。只有倍率保存在当前浏览器的网站来源下，记录键为 `dsh-plugin-chat-zoom:v1:percent`；不跨设备同步，也不按会话分别保存。

如需移除记录，先点击 **设置 → 缩放 → 清除倍率记忆**，再到插件页禁用或卸载插件。正常停用会移除插件自有监听器、倍率标记、提示和样式；可能需要刷新或重启。默认停用保留倍率记录，**不要为了清理倍率而清空整个 localStorage**。

安装包的下载和 DSH 插件管理器自身可能使用网络；上面的隐私说明仅描述本插件运行时。

## 已知限制与排查

- **设置中看不到“缩放”**：确认插件已安装并启用，刷新页面，必要时完整退出并重启 DSH。
- **所有网页元素一起放大**：可能是浏览器或桌面宿主先截获了快捷键。先用设置中的倍率控件；插件不能保证拦截宿主已处理的按键。
- **输入法或内嵌工具中不响应**：中文输入法组合输入、全局模态弹窗、聊天内嵌编辑器、终端和画布优先，插件有意避免抢占这些操作。
- **触控板捏合也触发缩放**：部分浏览器会将捏合报告为 `Ctrl` 滚轮，插件无法可靠区分。
- **升级 DSH 后不响应**：插件依赖宿主内部 DOM 属性，不匹配时不会对整个页面强制缩放；可能需要更新适配。
- **保存倍率失败**：浏览器可能限制本地存储，本次缩放仍可生效，但无法保证刷新后恢复。

本次发布检查涵盖 JavaScript 语法、包内引用和客户端模块注册；不代表已完成所有 DSH 版本、物理鼠标操作或真实输入法的实机验证。

## 仓库内容与重新打包

本仓库包含插件文件、文档及无依赖的轻量回归测试，不包含私人聊天、缓存、安装配置备份或迁移工具。`lib/client.js` 为完整、可读的预构建客户端实现；本仓库未提供原始拆分源码和构建工具。

在 Node.js 24 上运行 `node --test tests/chat-zoom.test.mjs` 可执行模拟 DOM 的事件回归测试。测试先在旧逻辑下复现焦点抢占，再验证修正；测试文件不随插件安装包分发。这不是 DSH/浏览器实机验收，详见[更新说明](CHANGELOG.md)。

| 文件 | 用途 |
| --- | --- |
| `package.json` | 包版本、入口与 DSH 元数据 |
| `index.js` | 宿主入口；功能在浏览器客户端运行 |
| `cordis.patch.yml` | DSH 插件注册配置 |
| `lib/client.js` | 完整客户端逻辑与设置界面 |
| `README.md` | 中英双语使用说明 |
| `LICENSE` | MIT 许可证 |

维护者可在仓库根目录使用 Node.js / npm 重新打包：

```sh
npm pack --ignore-scripts
```

生成的 `.tgz` 安装包不提交到源码仓库，而是上传到 GitHub Releases。发布包包含本文档和许可证，不包含 Git 元数据。

---

<a id="english"></a>

## English

**DSH Chat Zoom** changes the size of chat messages and the input area in **DeepSeek Harness (DSH)**. It does not zoom the sidebar, settings pages, or global dialogs.

- Display name: **缩放** (Zoom)
- Package / repository: `dsh-plugin-chat-zoom`
- First GitHub release: **v0.1.0**
- License: [MIT](LICENSE)

[Download v0.1.0](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/tag/v0.1.0) · [Report an issue](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues)

Additional documents: [Changelog](CHANGELOG.md) · [Privacy](PRIVACY.md) · [Contributing](CONTRIBUTING.md) · [Market and merge notes](MARKET.md). These documents were added on main after release; the original v0.1.0 tag and archive remain unchanged. Submission does not mean admission.

**Current main development version: v0.1.1 (no released package yet).** The keyboard focus fix is in the current source only. The downloads below and the market entry still point to published v0.1.0, which does not contain this fix.

### Features

- Zoom text, code, images, and input controls together using layout zoom.
- Default: **100%**. Range: **80%–200%**. Keyboard shortcuts and zoom buttons change the value by **10 percentage points**.
- Change the zoom level, reset it, or clear the saved preference in settings.
- Show a small zoom hint after an action. It disappears **5 seconds** after the last action. There is no permanent zoom toolbar in the chat.
- Share one zoom level across chat panels on the same page. Save the preference locally for the current browser origin.
- Try to keep the current reading position instead of jumping to the top or bottom.

### Requirements

This is a **DSH plugin**, not a Chrome / Edge extension or a standalone website.

It requires DSH's client module loader, shared React module, and `settings.section` slot, plus a browser that supports CSS `zoom`. The adapter targets internal chat DOM attributes from **DSH 0.2.0-rc.2**. Compatibility with other DSH versions is not guaranteed. **v0.1.0 is the plugin version, not the DSH version.**

The package includes the runnable client. You do not need to build it or install a separate React copy. The plugin UI currently uses Chinese; this README is bilingual.

### Installation

#### Option 1: Use the DSH Plugins page (recommended)

1. Download **`dsh-plugin-chat-zoom-0.1.0.tgz`** from the [v0.1.0 release](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/tag/v0.1.0). GitHub's automatic source ZIP is not the plugin installation package.
2. Open **Plugins** in the DSH sidebar and choose the external plugin / bundle installation entry.
3. Enter the downloaded file's **absolute path**, for example `C:/Downloads/dsh-plugin-chat-zoom-0.1.0.tgz`. Replace this example with your real path. The file must be accessible from the computer running DSH; a file on a remote browser's computer may not be accessible to the DSH host.
4. Confirm installation and check that `dsh-plugin-chat-zoom` is enabled. If the installation entry accepts HTTP(S) tarball URLs, you can also use the direct URL below.
5. Refresh DSH, then open **Settings → 缩放 (Zoom)**. If the section is missing, fully exit and restart DSH, not just the browser page.

Direct package URL:

```text
https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/download/v0.1.0/dsh-plugin-chat-zoom-0.1.0.tgz
```

#### Option 2: Use the DSH CLI

If the `dsh` command is available, a desktop installation can use:

```sh
dsh plugin --profile desktop add "dsh-plugin-chat-zoom@https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/releases/download/v0.1.0/dsh-plugin-chat-zoom-0.1.0.tgz" --ignore-scripts
```

For an offline installation from a downloaded Windows file:

```sh
dsh plugin --profile desktop add "dsh-plugin-chat-zoom@file:C:/Downloads/dsh-plugin-chat-zoom-0.1.0.tgz" --offline --ignore-scripts
```

Replace the path and `desktop` profile with your actual download location and active profile. Use the Plugins page if you do not know the profile or do not have the `dsh` command. These commands are for the user to run; this repository does not automatically change DSH settings. The plugin has no installation scripts.

#### Option 3: Install the repository directory

Download and extract the source archive, or clone this repository. In the DSH Plugins page, use the **absolute path of the directory containing `package.json`** as the installation source. Do not select the `lib` subdirectory.

### Usage

Open **Settings → 缩放 (Zoom)**:

| Chinese UI label | Meaning |
| --- | --- |
| 聊天倍率 | Select a chat zoom level from 80% to 200% |
| 缩小 / 放大 | Zoom out / in by 10 percentage points |
| 恢复 100% | Reset to 100% and save this value |
| 清除倍率记忆 | Reset to 100% and remove this plugin's saved preference |

Changes take effect immediately. Clearing the preference does not delete chats, drafts, or other settings.

| Shortcut | Action | Where it works |
| --- | --- | --- |
| `Ctrl` + wheel up / down | Zoom in / out | Pointer over the chat messages or input area |
| `Ctrl` + `+` / `-` | Zoom in / out | Input area focused; or no other control focused while the pointer is over the chat |
| `Ctrl` + `0` | Reset to 100% | Same keyboard focus rules as above |

The plus shortcut also accepts `Ctrl` + `=` and `Ctrl` + `Shift` + `=`. Numpad plus and minus are supported. Normal scrolling and editing shortcuts such as `Ctrl+C/V/Z` are not intercepted.

Starting with v0.1.1 on main, focused input means a textarea, text input, or contenteditable text area inside the composer. Focus on message buttons, links, the send button, file inputs, checkboxes, or selects does not claim keyboard zoom, even while the pointer remains over the chat. With no control focused, the pointer must still hover over the chat. Wheel and settings behavior is unchanged. An unclaimed key may still be handled by the browser or host.

### Privacy and removal

The plugin itself makes no network requests, uploads no chats, collects no telemetry, and writes no server settings. Only the zoom preference is stored locally under `dsh-plugin-chat-zoom:v1:percent` for the current browser origin. It is not synced across devices or saved separately per conversation.

To remove the preference, use **Settings → 缩放 → 清除倍率记忆** before disabling or uninstalling the plugin from the Plugins page. Normal cleanup removes the plugin's listeners, zoom markers, hints, and styles; a refresh or restart may be needed. Disabling keeps the preference by default. **Do not clear all localStorage just to remove the zoom preference.**

Downloading the package and using DSH's plugin manager may involve network requests. The privacy statement above describes this plugin's runtime only.

### Limitations and troubleshooting

- **No Zoom settings section:** check installation and enabled status, refresh, and fully restart DSH if needed.
- **The whole page zooms:** the browser or desktop host may handle the shortcut first. Use the settings controls instead. The plugin cannot reliably block keys already handled by the host.
- **No response during composition or in embedded tools:** IME composition, global modal dialogs, embedded editors, terminals, and canvases have priority. This is intentional.
- **Trackpad pinch triggers zoom:** some browsers report pinch gestures as `Ctrl` wheel events; the plugin cannot reliably tell them apart.
- **No response after a DSH update:** internal DOM attributes may have changed. The plugin avoids falling back to whole-page zoom and may need an adapter update.
- **Preference not saved:** the browser may block local storage. Zoom can still work for the current page, but may not be restored after a refresh.

Release checks cover JavaScript syntax, package references, and client module registration. They do not prove real-device testing across all DSH versions, physical mouse actions, or actual IME input.

### Repository and packaging

The repository contains plugin files, documentation, and small dependency-free regression tests. It excludes private conversations, caches, installation/configuration backups, and migration tools. `lib/client.js` is the complete, readable prebuilt client implementation; the original split sources and build tools are not included.

Run `node --test tests/chat-zoom.test.mjs` on Node.js 24 for simulated-DOM event regression checks. The tests reproduced the focus issue before the fix and verify the corrected behavior. Tests are excluded from installation packages. They are not real DSH/browser acceptance; see the [changelog](CHANGELOG.md).

| File | Purpose |
| --- | --- |
| `package.json` | Version, entry points, and DSH metadata |
| `index.js` | Host entry; features run in the browser client |
| `cordis.patch.yml` | DSH plugin registration |
| `lib/client.js` | Complete client logic and settings UI |
| `README.md` | Bilingual instructions |
| `LICENSE` | MIT license |

Maintainers can create a package in the repository root using Node.js / npm:

```sh
npm pack --ignore-scripts
```

Upload the generated `.tgz` to GitHub Releases rather than committing it to the source repository. The package includes this README and the license, but no Git metadata.

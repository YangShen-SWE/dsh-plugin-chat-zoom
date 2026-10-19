# Privacy · 隐私说明

## 中文

本说明区分已发布 v0.1.0 与当前 main 的 **v0.3.2（未发布）**；不涵盖 DSH 宿主、GitHub 下载或其他插件。main 的开发变化不属于旧 v0.1.0 安装包。本次仅澄清文档，不新增存储、网络或权限。

### 实际本地记录

所有记录均在当前浏览器网站来源的 `localStorage`，实际保存值都是字符串。下例将键盘/滚轮的 JSON 字符串解码为对象以便阅读，**不是需要复制执行的配置，也不表示启动时会创建默认记录**：

```json
{
  "dsh-plugin-chat-zoom:v1:percent": "100",
  "dsh-plugin-chat-zoom:v1:keyboard": {
    "version": 1,
    "bindings": { "zoomIn": "Ctrl+Plus", "zoomOut": "Ctrl+Minus", "reset": "Ctrl+0" }
  },
  "dsh-plugin-chat-zoom:v1:wheel": { "version": 1, "modifier": "Ctrl" }
}
```

- **倍率**：v0.1.0 与 main 共用原倍率键，保存 80–200 的整数十进制字符串。缺失/无效时使用 100%，不会仅因读取就覆写原记录。main 中调整倍率或“恢复 100%”会尝试保存（当前已经 100% 也会重试）；旧 v0.1.0 在倍率相同时不会重写记录。“清除倍率记忆”恢复 100% 并尝试删除此键。
- **键盘与滚轮（仅 main）**：键盘保存版本号 1 和三个规范化绑定；仅在“保存快捷键”时尝试写入，未保存的表单输入只在当前组件内存中。“恢复默认快捷键”丢弃该草稿、恢复 Ctrl+Plus / Ctrl+Minus / Ctrl+0，并仅删除键盘键。滚轮选择 Ctrl/Alt/Shift/Meta 之一后立即生效并尝试写入；“恢复默认滚轮”恢复 Ctrl 并仅删除滚轮键。两者不改变倍率或彼此的记录；滚轮操作不丢弃键盘草稿。
- **异常与范围**：缺失、无效或未来键盘/滚轮配置回退默认，不迁移旧倍率、不在读取时静默覆盖异常记录；以后主动保存或恢复默认会写入/删除对应记录。无法读取时安全使用默认；无法写入/删除时操作反馈说明本页有效或清理失败，刷新可能恢复此前记录。不保存按键/滚轮事件日志、聊天内容、账号或设备标识；不跨设备、标签页实时同步，也不按会话保存。
- **页面与旧版差异**：读取聊天 DOM、焦点与布局位置，监听限定范围事件并调整消息/输入区的 CSS `zoom`，不修改聊天记录或输入草稿。main 的键盘只在输入区文字编辑焦点或闲置焦点悬停聊天时接管；main 滚轮只接管所选单个修饰键，普通滚轮或叠加其他修饰键不接管。旧 v0.1.0 的聊天控件焦点范围较宽，且 Ctrl+Shift 滚轮也可触发；不能把 main 的收窄规则说成旧包已有。IME/弹窗/工具等限制见 [使用说明](README.md)。宿主入口不执行服务端功能。
- **网络与权限**：插件自身不请求网络、不调用模型、不读取凭据、不写服务端配置、不收集遥测；没有安装生命周期脚本。安装包下载与 DSH 插件管理可能使用网络。
- **清除与卸载**：main 中先“恢复默认快捷键”与“恢复默认滚轮”，再“清除倍率记忆”，确认各自状态没有失败后禁用/卸载；v0.1.0 仅有倍率键。正常停用移除自有监听器、提示、样式与倍率标记，但保留现存偏好；必要时刷新或完整重启 DSH。停用后不会再主动写入；重新启用后若再次操作，会重新保存相应记录。失败反馈不代表清除成功，**不要清空整个 localStorage**。

报告问题请勿上传私人聊天、账号、令牌或完整个人配置；仅提供版本、步骤与必要脱敏信息：[Issues](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues)。

## English

This statement distinguishes released v0.1.0 from **v0.3.2 on main (unreleased)**. It excludes the DSH host, GitHub downloads and other plugins. Main's changes are not in the old archive. This documentation update adds no storage, network access or permissions.

### Actual local records

All records use the current browser origin's `localStorage`, whose values are strings. For readability, the example below decodes the keyboard/wheel JSON strings into objects. **It is not configuration to paste or execute, and defaults are not automatically written on startup.**

```json
{
  "dsh-plugin-chat-zoom:v1:percent": "100",
  "dsh-plugin-chat-zoom:v1:keyboard": {
    "version": 1,
    "bindings": { "zoomIn": "Ctrl+Plus", "zoomOut": "Ctrl+Minus", "reset": "Ctrl+0" }
  },
  "dsh-plugin-chat-zoom:v1:wheel": { "version": 1, "modifier": "Ctrl" }
}
```

- **Level:** released v0.1.0 and main share the original key and store an integer decimal string from 80 to 200. Missing/invalid data defaults to 100% without a read-time rewrite. On main, level changes and reset attempt a save, even when already at 100%; old v0.1.0 does not rewrite an unchanged level. Clear resets to 100% and attempts to remove only this key.
- **Keyboard/wheel (main only):** keyboard JSON contains schema version 1 and three normalized chords. Only Save writes it; unsaved form drafts stay in component memory. Restore-default keyboard discards drafts, restores Ctrl+Plus / Ctrl+Minus / Ctrl+0 and removes only the keyboard key. Selecting Ctrl/Alt/Shift/Meta for wheels applies immediately and attempts a save; restore-default wheel restores Ctrl and removes only the wheel key. Neither changes the level or the other's record; wheel actions preserve keyboard drafts.
- **Failures/scope:** missing, invalid or future keyboard/wheel records default without migration or read-time overwrite. A later explicit save/default reset can write/remove that record. Failed reads safely default; failed writes/removals report page-only behavior or cleanup failure, and refresh may restore earlier records. No event logs, chats, accounts or device IDs; no cross-device/live-tab sync or per-chat settings.
- **Page access and old-version difference:** inspect scoped DOM/focus/layout and apply CSS zoom without changing chat records or input drafts. Main keyboard capture requires a composer text editor or idle focus with chat hover. Main wheels require exactly the selected modifier; normal/extra-modifier wheels are unclaimed. Old v0.1.0 accepts broader chat-control focus and Ctrl+Shift wheels: main's narrower rules are not already in the old package. See [usage](README.md) for IME/dialog/tool exclusions. The host entry is inert.
- **Network/permissions:** no plugin network requests, model calls, credential access, server configuration writes, telemetry or installation lifecycle scripts. Downloads and DSH plugin management may use the network.
- **Removal:** on main restore keyboard defaults, restore wheel defaults, then clear the level; check each status for failure before disabling/uninstalling. v0.1.0 has only the level key. Normal cleanup removes owned listeners, hints, styles and markers but retains existing preferences. Refresh/restart if needed. After disabling, no further plugin writes occur; later operations after re-enabling can save records again. Failure feedback is not proof of deletion. **Do not clear all localStorage.**

Do not share private chats, accounts, tokens or full personal configurations in [issues](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues). Include versions, steps and only necessary redacted information.

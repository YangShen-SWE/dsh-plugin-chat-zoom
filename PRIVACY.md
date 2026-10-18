# Privacy · 隐私说明

## 中文

本说明区分已发布 v0.1.0 与当前 main 的 **v0.3.1（未发布）**；不涵盖 DSH 宿主、GitHub 下载或其他插件。main 的开发变化不属于旧 v0.1.0 安装包。

- **保存什么**：v0.1.0 及 main 都在当前浏览器来源的 `localStorage` 保存聊天倍率（80–200 的整数），键名 `dsh-plugin-chat-zoom:v1:percent`。main 另以 `dsh-plugin-chat-zoom:v1:keyboard` 保存 JSON：版本号 `1` 与放大、缩小、复位的三个规范化绑定字符串；以 `dsh-plugin-chat-zoom:v1:wheel` 保存 JSON：`{"version":1,"modifier":"Ctrl"}`，modifier 为 Ctrl/Alt/Shift/Meta 中的一个。不保存按键/滚轮事件日志、聊天内容、账号或设备标识。不跨设备、标签页实时同步，也不按会话保存。
- **兼容与异常**：没有键盘/滚轮配置时分别使用默认绑定和 Ctrl，不改原倍率记录。无效或未来格式回退默认，不静默覆盖原记录。键盘点击保存后、滚轮选择后本页即生效；本地写入/删除失败会明确提示，刷新后可能恢复此前存储值。倍率恢复至 100% 会保存该数值；后续调整会重新保存倍率。
- **如何使用页面**：读取聊天 DOM、焦点及布局位置，监听受范围限制的键盘和滚轮事件，调整消息与输入区的 CSS `zoom`。普通无修饰滚轮与叠加其他修饰键的滚轮不接管。不把聊天内容复制到持久存储，不修改聊天记录或草稿数据。宿主入口不执行服务端功能。
- **网络与权限**：插件自身不请求网络，不调用模型，不读取凭据，不写服务端配置，不收集遥测；没有安装生命周期脚本。安装包下载与 DSH 插件管理可能使用网络。
- **清除与卸载**：main 中先在“设置 → 缩放”点击“恢复默认快捷键”（只删键盘配置）与“恢复默认滚轮”（恢复 Ctrl，只删滚轮配置），倍率不变；再点击“清除倍率记忆”（恢复 100% 并删除倍率键，键盘/滚轮不变），然后禁用/卸载。v0.1.0 只有倍率键可清除。正常停用移除自有监听器、提示、样式与倍率标记，但默认保留偏好；必要时刷新或完整重启 DSH。失败反馈不得当作清除成功；不要清空整个 `localStorage`。

报告问题时请勿上传私人聊天、账号、令牌或完整个人配置。只提供宿主/浏览器版本、步骤及必要的脱敏信息：[Issues](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues)。

## English

This statement distinguishes published v0.1.0 from **v0.3.1 on main (unreleased)**. It excludes the DSH host, GitHub downloads and other plugins. Main's changes are not in the original v0.1.0 archive.

- **Stored data:** both versions store an integer percentage (80–200) in origin-local `localStorage`, under `dsh-plugin-chat-zoom:v1:percent`. Main also stores JSON under `dsh-plugin-chat-zoom:v1:keyboard`: schema version `1` and three normalized binding strings. `dsh-plugin-chat-zoom:v1:wheel` stores JSON such as `{"version":1,"modifier":"Ctrl"}`, with one of Ctrl/Alt/Shift/Meta. No key/wheel event logs, chats, accounts or device IDs. No cross-device/live-tab sync or per-chat records.
- **Compatibility/failures:** missing keyboard/wheel preferences use default chords and Ctrl without changing the old percentage record. Invalid/future records default without silent overwrite. Keyboard settings apply after Save; wheel choices apply immediately. Explicit feedback warns that failed storage writes/removals may restore previous values on refresh. Resetting the level saves 100%; later adjustments save the level again.
- **Page access:** inspect scoped chat DOM, focus and layout; listen for scoped keyboard/wheel events; apply CSS `zoom` to messages and the composer. Unmodified wheels or wheels with extra modifiers are not claimed. Chat text is not copied into persistent storage. Chat records and draft data are not edited. The host entry is inert.
- **Network/permissions:** no plugin network requests, model calls, credential access, server configuration writes, telemetry or install lifecycle scripts. Package downloads and DSH plugin management may use the network.
- **Removal:** on main, use Settings → 缩放 → 恢复默认快捷键 to remove only keyboard preferences and 恢复默认滚轮 to restore Ctrl/remove only wheel preferences, leaving the level unchanged. Then 清除倍率记忆 resets/removes only the percentage, not keyboard/wheel settings. Disable or uninstall afterward. v0.1.0 stores only the percentage. Cleanup removes owned listeners, hints, styles and markers but normally retains preferences. Refresh/restart if needed. A failure message is not proof of deletion; do not clear all local storage.

Do not share private chats, accounts, tokens or full personal configurations in [issue reports](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues). Include versions, steps and only necessary redacted details.

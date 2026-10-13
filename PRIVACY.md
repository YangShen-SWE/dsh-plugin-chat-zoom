# Privacy · 隐私说明

## 中文

本说明适用于 `dsh-plugin-chat-zoom` v0.1.0 的插件运行时，不涵盖 DSH 宿主、GitHub 下载或其他插件。

- **保存什么**：只保存聊天倍率（80–200 的整数），键名为 `dsh-plugin-chat-zoom:v1:percent`，位置是当前浏览器来源的 `localStorage`。不跨设备同步，也不按聊天会话保存。
- **如何使用页面**：读取聊天 DOM 结构、焦点和布局位置，监听相关键盘与滚轮事件，调整聊天消息和输入区的 CSS `zoom`。不把聊天内容提取到持久存储，不修改聊天记录或草稿数据。宿主入口不执行服务端功能。
- **网络与权限**：插件自身不请求网络，不调用模型，不读取账户凭据，不写服务端配置，不收集遥测；没有安装生命周期脚本。安装包下载与 DSH 插件管理可能使用网络。
- **清除与卸载**：先使用“设置 → 缩放 → 清除倍率记忆”，再禁用或卸载。正常停用移除插件自有监听器、提示、样式和倍率标记，但默认保留倍率偏好。必要时刷新或完整重启 DSH；不要清空整个 `localStorage`。
- **存储不可用**：在禁止本地存储的环境中，本页操作可用，但刷新后不保证恢复倍率。

报告问题时请勿上传私人聊天、账号、令牌或完整个人配置。只提供宿主/浏览器版本、复现步骤及必要的脱敏界面信息：[Issues](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues)。

## English

This statement covers the plugin runtime in v0.1.0, not the DSH host, GitHub downloads, or other plugins.

- **Stored data:** only an integer zoom percentage (80–200), under `dsh-plugin-chat-zoom:v1:percent` in the current browser origin's `localStorage`. No device sync or per-chat records.
- **Page access:** inspect chat DOM structure, focus and layout; listen for scoped keyboard/wheel events; apply CSS `zoom` to messages and the input area. Chat text is not copied into persistent storage. Chat records and draft data are not edited. The host entry is inert.
- **Network and permissions:** no plugin network requests, model calls, credential access, server configuration writes, telemetry, or install lifecycle scripts. Package downloads and DSH plugin management may use the network.
- **Removal:** use Settings → 缩放 → 清除倍率记忆 before disabling or uninstalling. Normal cleanup removes owned listeners, hints, styles and zoom markers, but keeps the saved preference by default. Refresh or fully restart DSH if needed. Do not clear all local storage.
- **Blocked storage:** zoom can still work for the current page, but the preference may not survive a refresh.

Do not include private chats, accounts, tokens or full personal configurations in [issue reports](https://github.com/YangShen-SWE/dsh-plugin-chat-zoom/issues). Share host/browser versions, steps and only necessary redacted UI details.

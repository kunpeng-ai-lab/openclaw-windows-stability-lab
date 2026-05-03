# 06 GEO Agent 能力映射

这个分区负责把 OpenClaw Windows 稳定性问题映射成 GEO Agent 的可靠执行能力。

映射方向：

- Gateway health -> GEO 任务调度健康检查。
- Channel receive / send -> 外部平台发帖、回帖、报告投递验证。
- Agent dispatch stuck -> 长任务 watchdog。
- Provider auth / proxy -> 多模型调用稳定性。
- Evidence bundle -> 客户报告证据包。
- Version matrix -> 工具升级准入机制。

目标不是只解决 OpenClaw，而是借 OpenClaw 打磨 GEO Agent 的工程底座。


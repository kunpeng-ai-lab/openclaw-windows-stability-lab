# OpenClaw Windows Stability Lab 项目级协作 SOP

Date: 2026-05-02

本文件是 OpenClaw Windows Stability Lab 项目的项目级协作红线规则。所有 Agent 和人工协作者都必须遵守。

## 1. 项目分工

| 项目 | 简称 | 执行方 | Reviewer |
| --- | --- | --- | --- |
| `openclaw-windows-stability-lab` | OWSL | Codex | Claude Code |

### 执行方职责

- 项目规划。
- harness、schema、wiki、case 设计与实现。
- Windows 稳定版本方案。
- OpenClaw 上游 issue / PR 分析。
- 上游报告与贡献策略。
- 稳定性测试矩阵和版本兼容矩阵。

### Reviewer 职责

- 代码审查。
- 测试审查。
- harness 验证。
- schema 审核。
- 文档清晰度审查。
- 上游 PR 风险审查。
- 向 Owner 做共识汇报。

## 2. 红线规则：共识汇报 Gate

两个 Agent 达成技术共识后，不能直接进入开发、M0、M1、P0 或具体实现。

必须先由本项目 Reviewer 向 Owner 做共识汇报。Owner 明确同意后，执行方才能继续。

### 汇报责任

OWSL 项目中：

- Codex 是执行方。
- Claude Code 是 Reviewer。
- 所以共识汇报由 Claude Code 负责。

执行方不能替代 Reviewer 向 Owner 做最终共识汇报。

### 汇报必须包含

1. 双方已经达成了什么共识。
2. 下一步准备做什么。
3. 为什么要这么做。
4. 关键风险是什么。
5. 哪些事项需要 Owner 确认或知情。
6. 是否会进入 P0/P1/P2、M0/M1 或开发执行。

## 3. 交付和审核流程

### 执行方交付物

执行方完成一个模块后，必须交付：

- 源代码或文档。
- 自测结果。
- 变更摘要：改了什么、为什么。
- 明确的审核请求：需要 Reviewer 重点看什么。

### Reviewer 输出

Reviewer 收到交付后必须：

1. 阅读代码和文档。
2. 运行必要测试或 harness 验证。
3. 输出结论：通过 / 需修改。
4. 若需修改，给出具体文件、位置和修改建议。
5. 若双方达成共识并准备进入下一阶段，先做共识汇报，不得直接开始执行。

## 4. 共享资产变更流程

涉及与 GA 共享的 schema、harness、runtime profile、case 格式时：

1. 任一方提出变更需求。
2. GA 和 OWSL 双方确认影响。
3. 双方确认后才可合并。
4. 合并后双方同步更新依赖和文档。
5. 如影响开闭源边界、商业边界或上游发布，必须提交 Owner 决策。

## 5. Owner 决策事项

涉及以下事项，两个 Agent 只能给建议，最终由 Owner 决策：

- 公开发布。
- OpenClaw 上游 PR 提交。
- 上游 issue 代表性表态。
- 商业边界变更。
- 闭源/开源边界变更。
- npm 正式发布。
- 使用或配置发布凭证。
- vendor 第三方 active diagnostic implementation。
- 进入 P0/P1/P2、M0/M1 或开发执行前的阶段性确认。

## 6. 当前已确认红线

- OWSL 不维护 OpenClaw fork。
- OWSL 优先产出可复现、可验证、可上游贡献的稳定性资产。
- `agent-windows-reliability` 必须提供稳定 JSON 契约，才能作为 GA 依赖。
- `agent-windows-reliability` 的正式 npm 发布需要 Owner/npm 凭证确认。
- 本地 link 方案可以作为 GA 解阻方案，但仍需 Reviewer 共识汇报和 Owner 同意后再执行。
- 不允许为了短期修复默认 patch 用户已安装的 OpenClaw 源码；代码级修复优先走上游 PR。


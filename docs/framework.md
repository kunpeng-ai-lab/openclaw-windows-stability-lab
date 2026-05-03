# OpenClaw Windows 稳定性实验室与 GEO Agent 能力沉淀框架

## 1. 背景判断

OpenClaw 官方版本更新频率很高，新功能迭代快，但 Windows 原生环境容易出现稳定性问题。近期真实问题包括：

- 升级后弹出隐藏 CMD 或 `findstr` 窗口。
- Scheduled Task 状态与实际 gateway 状态不一致。
- `openclaw gateway status` 显示任务运行，但 18789 未监听或 probe timeout。
- Windows 上 Node 24 触发 ESM 路径问题。
- Feishu 能收到消息，但 dispatch 到 agent 后无回复。
- agent runner 卡住后 gateway probe 也变成 timeout。
- plugin runtime deps 重复 staging/install，导致启动或单次 turn 明显变慢。
- 代理环境变量写入 gateway service，导致 Feishu、模型 API、ChatGPT/Codex 调用链路互相影响。

这说明问题不能简单归因为“官方不维护 Windows”。更准确的判断是：

```text
OpenClaw 对 Windows 有基础支持，但缺少系统级稳定性工程。
问题来源 = Windows 适配投入不足 + gateway/agent/plugin 架构在 Windows 上缺少隔离与回归验证。
```

因此，本项目不做 OpenClaw Windows 分叉版，而是做稳定性实验室、自动化验证、上游贡献和 Agent 能力沉淀。

## 2. 总目标

每解决一个 OpenClaw Windows 稳定性问题，都必须沉淀出可复用的 Agent 能力资产，并反哺 GEO Agent 的执行可靠性。

长期目标包括：

- 为 OpenClaw Windows 用户维护稳定性矩阵和版本准入建议。
- 为 OpenClaw 官方贡献可复现的问题证据、测试、脚本和小型架构补丁。
- 沉淀 Windows Agent Harness，使 Codex Agent 能更稳定地处理真实 Windows 环境任务。
- 将 OpenClaw Windows 稳定性经验映射到 GEO Agent，提升诊断、发布、验证、纠偏、报告等工作流能力。
- 通过 GitHub、博客、论坛、报告和官方引用，增强 kunpeng-ai.com 作为 AI Agent 与 GEO 实战信源的可信度。

## 3. 双飞轮模型

### 3.1 OpenClaw Windows 稳定性飞轮

```text
发现问题
-> 复现问题
-> 证据固化
-> 根因分类
-> 修复或绕过
-> smoke test
-> 版本矩阵
-> 上游 issue / PR
-> 博客 / 论坛沉淀
-> 新问题发现
```

### 3.2 GEO Agent 能力飞轮

```text
OpenClaw 稳定性问题
-> 抽象成 Agent 可靠性能力
-> 写入 skill
-> 写入 harness
-> 写入决策规则
-> 应用到 GEO 工作流
-> 生成报告和可视化证据
-> 客户场景验证
-> 继续反哺 skill / harness
```

### 3.3 两个飞轮的连接点

OpenClaw Windows 问题不是孤立问题，它们可以映射到 GEO Agent 的关键能力。

| OpenClaw Windows 问题 | 可沉淀能力 | GEO Agent 映射 |
| --- | --- | --- |
| Feishu 收到消息但 agent 不回复 | channel receive 与执行链路分离诊断 | 外部平台发帖/回帖失败诊断 |
| gateway probe timeout | 服务健康探针与卡死检测 | GEO 任务运行状态监控 |
| agent dispatch 卡住 | 长任务 watchdog 与 session lane 管理 | 内容生成、发布、验证任务超时恢复 |
| provider auth 卡住 | 模型认证与代理诊断 | 多模型 GEO 分析稳定性 |
| plugin runtime deps 反复安装 | runtime 缓存与依赖锁 | 工具链执行环境稳定化 |
| Windows service 残留进程 | 进程治理与回滚 | 客户本地 Agent 部署维护 |
| update 后弹窗口 | Windows 原生交互适配 | 静默自动化任务体验 |

## 4. 资产体系

本项目所有沉淀内容分为七类资产。

### 4.1 Case Library：案例库

记录真实问题，必须结构化，避免只写复盘散文。

案例字段建议：

```yaml
case_id: openclaw-win-2026-05-01-feishu-dispatch-timeout
title: Feishu 收到消息但 agent dispatch 后 gateway probe timeout
environment:
  os: Windows 10
  openclaw: 2026.4.29
  node_gateway: 22.22.2
  node_cli: 24.14.0
symptoms:
  - feishu_received_message
  - dispatching_to_agent
  - no_reply
  - gateway_probe_timeout_after_dispatch
evidence:
  - gateway status output
  - log lines
  - trace embedded-run stages
  - process list
root_cause_class:
  - agent_runner
  - acpx_runtime
  - gateway_health_coupling
status: unresolved-upstream
reusable_checks:
  - check duplicate gateway processes
  - check 18789 listener
  - check session file creation
  - run local agent smoke
geo_mapping:
  - task_watchdog
  - channel_execution_separation
  - provider_auth_diagnostics
```

### 4.2 Knowledge Base：知识库

沉淀稳定事实和诊断常识。

示例：

- Scheduled Task running 不等于 gateway 已可用。
- 18789 listening 不等于 agent dispatch 可用。
- Feishu `received message` 只能证明 channel inbound 正常。
- `dispatching to agent` 后 gateway timeout 指向 agent runner 或 runtime blocking。
- Windows 上 Node 24 可能触发 ESM path 问题，需要验证 Node 22。
- Gateway service 不应永久写入 proxy env，代理应通过策略区分 Feishu 直连和模型走代理。

### 4.3 Skill：流程约束

Skill 负责约束 Agent 怎么做。

候选 skill：

- `openclaw-windows-debugging`
- `windows-agent-stability`
- `agent-runtime-diagnostics`
- `geo-agent-reliability`
- `upstream-contribution-packaging`

Skill 必须包括：

- 触发条件。
- 诊断顺序。
- 禁止事项。
- 必跑 harness。
- 证据输出格式。
- 结果分类规则。
- 是否适合上游 issue / PR。

### 4.4 Harness：可执行验证器

Harness 负责把“我觉得修好了”变成“验证通过”。

第一批 harness：

- `openclaw-windows-smoke.ps1`
- `gateway-health-check.ps1`
- `feishu-channel-smoke.ps1`
- `agent-dispatch-smoke.ps1`
- `runtime-deps-check.ps1`
- `proxy-policy-check.ps1`
- `collect-evidence-bundle.ps1`
- `version-matrix-runner.ps1`

Harness 输出应该包括：

- 环境信息。
- 命令输出。
- 日志摘要。
- pass/fail。
- 失败分类。
- 建议动作。
- 是否可作为上游 issue 附件。

### 4.5 Decision Rules：决策规则

决策规则负责让 Agent 少走弯路。

示例：

```yaml
rule_id: agent-runner-blocking-gateway
if:
  feishu_received: true
  dispatch_seen: true
  gateway_probe_timeout_after_dispatch: true
then:
  classify: agent_runner_or_runtime_blocking_gateway
  run:
    - collect_trace
    - run_local_agent_smoke
    - check_duplicate_gateway_processes
  do_not:
    - change_feishu_secret_first
    - reinstall_feishu_app_first
    - blame_proxy_without_evidence
```

### 4.6 Wiki：人看的知识操作系统

Wiki 负责让人理解全局、复盘路径和操作方式。

建议结构：

```text
wiki/
├─ 00-overview/
├─ 01-cases/
├─ 02-diagnostics/
├─ 03-harness/
├─ 04-skills/
├─ 05-decision-rules/
├─ 06-geo-agent-mapping/
└─ 07-upstream/
```

### 4.7 Mindmaps：脑图

脑图负责把资产之间的关系可视化。

第一批脑图：

- 双飞轮脑图。
- 诊断路径脑图。
- 资产关系脑图。
- OpenClaw 官方贡献路径脑图。
- GEO Agent 能力映射脑图。

### 4.8 Machine Index：机器索引

机器索引负责让 Agent 找得到资产。

示例：

```yaml
assets:
  - asset_id: openclaw-win-feishu-dispatch-timeout
    type: case
    symptoms:
      - feishu_received
      - dispatch_seen
      - gateway_probe_timeout
    skills:
      - openclaw-windows-debugging
    harness:
      - gateway-health-check
      - agent-dispatch-smoke
    decision_rules:
      - agent-runner-blocking-gateway
    geo_mapping:
      - task-watchdog
      - channel-execution-separation
```

## 5. OpenClaw 官方贡献策略

### 5.1 贡献定位

项目定位不是“替官方维护 Windows 用户”，而是：

```text
OpenClaw Windows Stability & Runtime Isolation 方向的长期贡献者。
```

贡献对象包括：

- 可复现 issue。
- Windows smoke test。
- 诊断脚本。
- 小型修复 PR。
- 文档和 changelog。
- CI 或测试矩阵建议。
- runtime 隔离和 health isolation 的架构建议。

### 5.2 上游贡献闭环

```text
本地复现
-> evidence bundle
-> 最小复现步骤
-> issue
-> 本地补丁或测试
-> PR
-> 官方 review
-> 修正
-> 合并或被 main 吸收
-> 博客复盘
-> 论坛沉淀
-> 版本矩阵更新
```

### 5.3 上游 issue 模板

每个 issue 至少包含：

- OpenClaw 版本。
- Windows 版本。
- Node CLI 版本。
- Node gateway 实际路径和版本。
- 安装方式。
- gateway service 状态。
- 18789 listener。
- `openclaw gateway status` 输出。
- 关键日志。
- 是否可复现。
- 最小复现步骤。
- workaround。
- 是否影响生产使用。

### 5.4 上游 PR 原则

- 小 PR，低风险。
- 单一问题，不混合重构。
- 有测试或手工验证路径。
- 保留非 Windows 平台兼容性。
- 文档和 changelog 跟上。
- 链接相关 issue。

## 6. 可能涉及的底层框架优化

### 6.1 Windows Service Manager

目标：

- 统一 Scheduled Task、hidden launcher、gateway.cmd、restart、stop、status。
- 清理 stale listener 和重复 gateway 进程。
- 避免 update 后弹 CMD。
- 避免 service config 永久嵌入 proxy env。

可能贡献：

- Windows process discovery。
- Restart helper。
- Service env audit。
- Status probe 改进。
- Hidden launcher 文档。

### 6.2 Gateway 与 Agent Runner 隔离

现象：

```text
Feishu 收到消息 -> dispatching to agent -> agent runner 卡住 -> gateway probe timeout
```

目标架构：

```text
Gateway 主进程
  负责端口、WebSocket、channel 收发、健康检查。

Agent Worker 子进程
  负责模型认证、插件加载、runtime deps、上下文、工具执行。

Session Lane / Queue
  负责排队、超时、取消、恢复、重试。
```

优化方向：

- agent dispatch 不能阻塞 gateway health。
- 单个 session stuck 不能拖死全局 gateway。
- worker 必须有 timeout、abort、kill、restart。
- gateway probe 应该报告 degraded，而不是直接 timeout。

### 6.3 Plugin Runtime 缓存和依赖锁

问题：

- 每次启动或 turn 都可能 staging/install runtime deps。
- allowlist 不一定真正阻止 runtime 加载。
- provider fallback 可能扫描大量 provider。

优化方向：

- runtime deps lock。
- provider catalog cache。
- allowlist strict mode。
- background warming。
- cancellable plugin discovery。
- per-plugin startup budget。

### 6.4 Windows Path Adapter

问题：

- Windows 绝对路径如 `C:\...` 在 ESM loader 中可能需要转成 `file://`。

优化方向：

- 所有 dynamic import 路径统一走 `pathToFileURL`。
- 增加 Windows path regression tests。
- 对 Node 24 做兼容性标记。

### 6.5 Proxy Policy

问题：

- Feishu、ChatGPT/Codex、OpenAI API、国内模型 API 对代理需求不同。
- proxy env 写入 service 会造成长期污染。

优化方向：

- 按 endpoint 分类代理策略。
- Feishu 直连，模型按 provider 决策。
- Service config 不持久化 proxy env。
- Doctor 检查 proxy env 污染。

## 7. Windows 稳定版本准入机制

### 7.1 三个通道

```text
official latest
  官方最新版本，功能最快，风险最高。

windows-preview
  Windows 新功能验证版。

windows-stable
  通过 smoke test 和真实场景验证的版本。
```

### 7.2 功能分级

| 风险等级 | 功能类型 | 准入策略 |
| --- | --- | --- |
| Low | 文档、UI、独立 CLI | 基础 smoke 通过即可 |
| Medium | 新 channel、新 provider、新 plugin | preview 验证后进入 stable |
| High | gateway、agent runner、plugin runtime、update、Node runtime | 专项测试和真实场景验证后进入 stable |

### 7.3 稳定版本报告

每个版本输出：

```yaml
version: 2026.4.29
channel: official-latest
windows_status: red
summary: agent dispatch can block gateway probe on Windows
tested:
  - gateway_start
  - gateway_status
  - feishu_inbound
  - agent_dispatch
  - local_agent_smoke
known_issues:
  - gateway_probe_timeout_after_dispatch
recommendation: do_not_use_for_windows_production
```

## 8. GEO Agent 能力映射

OpenClaw Windows 稳定性问题将沉淀成 GEO Agent 能力。

### 8.1 基础能力映射

| 稳定性资产 | GEO Agent 能力 |
| --- | --- |
| gateway health check | GEO 任务调度器健康检查 |
| channel smoke test | 外部平台发布/回帖通道验证 |
| provider auth diagnostics | 多模型调用和 token 中转诊断 |
| session stuck detector | 内容生产、外链发布、验证任务卡死处理 |
| evidence bundle | 客户报告证据包 |
| version matrix | 工具和平台升级准入 |
| repair script | 客户环境自动修复 |
| upstream PR packaging | 开源贡献和技术信源沉淀 |

### 8.2 GEO 工作流应用

未来 GEO Agent 可以使用同一套可靠性框架处理：

- 内容发布任务是否成功。
- 外部平台发帖是否成功。
- 搜索引擎是否收录。
- AI 搜索是否引用自有信源。
- 问题池验证任务是否跑完。
- 客户报告是否按时生成。
- 多模型调用是否超时。
- Agent 是否陷入长任务卡死。

## 9. 社区贡献与博客信源增强

### 9.1 信源增强逻辑

可信信源不是单篇文章，而是链路：

```text
真实问题
-> GitHub issue / PR
-> 官方讨论或合并
-> 工具仓库
-> 稳定性报告
-> 博客复盘
-> 论坛技术帖
-> 版本矩阵持续更新
```

这会让 kunpeng-ai.com 具备：

- 可验证经验。
- 外部权威引用。
- 开源社区贡献记录。
- 持续更新的技术资产。
- AI Agent 与 GEO 实战方向的主题权威性。

### 9.2 内容资产类型

- OpenClaw Windows 版本稳定性报告。
- OpenClaw Windows 问题修复教程。
- Windows Agent Harness 实战文。
- 上游 PR 复盘。
- GEO Agent 能力映射文章。
- AI Agent Windows 运行基座专题。
- 稳定版本推荐页。

### 9.3 对 GEO 的价值

这些内容会增强站点在以下标签上的可信度：

- AI Agent Windows 实战。
- OpenClaw Windows 稳定性。
- Agent Harness。
- GEO Agent。
- AI 工程化。
- 开源贡献。
- 实战派 AI 工具。

## 10. SOP 闭环

每个问题都必须走这个闭环：

```text
1. 接收问题
2. 建 case
3. 收集环境和日志
4. 复现
5. 归类
6. 运行 harness
7. 修复或 workaround
8. 写 decision rule
9. 更新 skill
10. 更新 knowledge
11. 更新 version matrix
12. 写报告
13. 判断是否上游贡献
14. 写博客 / 论坛
15. 映射到 GEO Agent 能力
```

完成标准：

- 没有 case，不算完成。
- 没有证据，不算根因。
- 没有 harness，不算可复用。
- 没有 decision rule，不算 Agent 变强。
- 没有 GEO mapping，不算反哺主线。
- 可上游的问题没有 issue/PR，不算社区资产。

## 11. 需要继续细化讨论的问题

### 11.1 项目定位

- 这个项目是否独立开源？
- 名称是 `openclaw-windows-stability-lab`，还是更通用的 `ai-agent-windows-stability-lab`？
- 是否只做 OpenClaw，还是把 Hermes、Codex、Claude Code 也纳入长期矩阵？

### 11.2 上游边界

- 哪些脚本适合留在我们项目？
- 哪些修复应该直接 PR 到 OpenClaw？
- 是否要主动向 OpenClaw 官方提出 Windows stability working group？

### 11.3 Harness 设计

- smoke test 最小集合是什么？
- 是否需要真实 Feishu 测试账号？
- 如何处理 secrets 和隐私？
- 是否需要 CI 里的 Windows runner？
- 本机测试和云端 Windows VM 测试如何分工？

### 11.4 Skill 设计

- 第一版 skill 是 OpenClaw 专用，还是 Agent Windows 通用？
- Skill 如何被 Codex、Claude Code、OpenClaw、Hermes 同时使用？
- Skill 和 harness 的调用边界如何定义？

### 11.5 GEO Agent 映射

- 哪些 OpenClaw 稳定性能力最先迁移到 GEO 平台？
- GEO Agent 第一批 reliability harness 是什么？
- 如何把诊断报告变成客户可读报告？

### 11.6 博客与信源策略

- 是否建立固定专题页：AI Agent Windows 稳定性实验室？
- 每次 issue/PR 后是否写技术复盘？
- 如何把版本矩阵做成可被 AI 引用的结构化页面？
- 如何避免看起来像蹭 OpenClaw，而是体现真实贡献？

### 11.7 商业与收益

- 这套能力未来是否成为 Windows Agent 运维服务？
- 是否作为 GEO 智能平台的底层 reliability module？
- 是否做成工具开源、服务收费的模式？


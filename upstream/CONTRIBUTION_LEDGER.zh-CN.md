# OWSL 上游贡献台账

更新时间：2026-05-02 19:10 +08:00

这个台账用于长期记录 OWSL / OpenClaw / Hermes 相关上游贡献。每一条贡献都必须能追溯到公开链接、本地验证、截图证据和后续状态，方便后续复盘、文章、视频和客户材料复用。

## 总览

| 编号 | 项目 | 上游对象 | 主题 | 状态 | 主记录 |
| --- | --- | --- | --- | --- | --- |
| OWSL-UP-2026-05-02-001 | OWSL Phase 2 | OpenClaw PR #76024 / Issue #64187 | Windows SQLite atomic reindex `EBUSY` 文件锁修复 | Merged by `steipete` | `upstream/contributions/openclaw-pr-76024.zh-CN.md` |

## OWSL-UP-2026-05-02-001

### 基本信息

| 字段 | 内容 |
| --- | --- |
| 上游仓库 | `openclaw/openclaw` |
| PR | https://github.com/openclaw/openclaw/pull/76024 |
| Issue | https://github.com/openclaw/openclaw/issues/64187 |
| PR 标题 | `fix(memory): retry transient index swaps on Windows` |
| PR 状态 | Merged / Closed |
| 贡献账号 | `kunpeng-ai-lab` |
| Source branch | `kunpeng-ai-lab:codex/openclaw-64187-sqlite-ebusy` |
| Target branch | `openclaw:main` |
| 提交 hash | `2b53246ab5cc75a0e46309c52cdc653afcc40d04` |
| 短 hash | `2b53246` |
| Merge commit | `f3fd0eedff215967eb75361d241dd5e6cea602e8` |
| Merged by | `steipete` |
| Merged at | 2026-05-02 18:07:49 +08:00 |
| 提交日期 | 2026-05-02，GitHub commits 页面可见 |
| PR 提交时间 | 2026-05-02 17:57:54 +08:00，本地 handoff 记录 |
| 变更文件数 | 3 |
| 变更规模 | `+137 -11`，GitHub Checks 页面可见 |
| 本地工作树 | `C:\Users\kzy-1\.config\superpowers\worktrees\openclaw\codex-openclaw-64187-sqlite-ebusy` |

### 贡献摘要

这个 PR 针对 OpenClaw Issue #64187：Windows 上 memory atomic reindex 过程中，SQLite index 文件族执行 `fs.rename` 时可能遇到瞬时 `EBUSY` / `EPERM` / `EACCES` 文件锁。

本次补丁只处理 memory-core atomic reindex 的文件交换边界：

- 对瞬时 rename 错误增加有限重试。
- 保留 optional `-wal` / `-shm` sidecar 的 `ENOENT` 忽略行为。
- 非瞬时错误立即抛出。
- 增加确定性单元测试，不依赖真实 Windows 文件锁偶发现象。
- 不改 SQLite journal mode、不改全局 `busy_timeout`、不扩大到其他 SQLite store。

### Bot review 与上游反馈

| 来源 | 状态 | 记录 |
| --- | --- | --- |
| `openclaw-barnacle` bot | 已加标签 | `extensions: memory-core`、`size: S` |
| `clawsweeper` bot | 已 review | 结论是需要 maintainer review before merge；认可复现信息、补丁范围、测试和 changelog；提醒 maintainers 需要在本 PR 的 retry-only 方案与 #71611 fallback 方案之间选择 |
| `steipete` | 已合并 | GitHub API events 显示 `steipete` 于 2026-05-02 18:07:49 +08:00 merged 并 closed PR #76024 |
| PR 页面 reactions | 已有 bot reactions | `clawsweeper[bot]` 有 thumbs up / eyes reaction |

### CI / Checks 状态

| 来源 | 状态 |
| --- | --- |
| GitHub Checks 页面 | 当前公开页面显示 79 个 checks |
| 公开页面可见项 | `auto-response` succeeded；页面有 2 条 annotations，内容是 `actions/create-github-app-token@v3` 的 `app-id` deprecated warning |
| 截图证据 | `evidence/openclaw-pr-76024/pr-76024-conversation-fullpage-2026-05-02.png` 显示可见 CI jobs 为成功状态 |
| 备注 | GitHub 的完整 checks 详情依赖动态页面和登录态；本台账把“公开页面可见状态”和“截图留存状态”分开记录 |

### 无冲突状态

| 来源 | 状态 |
| --- | --- |
| 截图证据 | 显示 `No conflicts with base branch` 与 `Changes can be cleanly merged` |
| 截图路径 | `D:\workspace\openclaw-windows-stability-lab\evidence\openclaw-pr-76024\pr-76024-conversation-fullpage-2026-05-02.png` |

### 本地验证命令与结果

执行目录：

```text
C:\Users\kzy-1\.config\superpowers\worktrees\openclaw\codex-openclaw-64187-sqlite-ebusy
```

| 验证项 | 命令 | 结果 |
| --- | --- | --- |
| Targeted tests, Node 24 | `pnpm exec vitest run extensions/memory-core/src/memory/manager.atomic-reindex.test.ts` | 1 test file passed，6 tests passed |
| Targeted tests, Node 22 | `$env:Path = 'D:\nvm4w\nodejs;' + $env:Path; node --version; pnpm exec vitest run extensions/memory-core/src/memory/manager.atomic-reindex.test.ts` | Node `v22.22.2`；1 test file passed，6 tests passed |
| Extension lint | `$env:Path = 'D:\nvm4w\nodejs;' + $env:Path; pnpm lint:extensions -- extensions/memory-core/src/memory/manager-atomic-reindex.ts extensions/memory-core/src/memory/manager.atomic-reindex.test.ts` | 0 warnings，0 errors |
| Changed check | `$env:Path = 'D:\nvm4w\nodejs;' + $env:Path; pnpm check:changed` | exit code 0 |
| Diff check | `git diff --check` | exit code 0 |

### 证据路径

| 类型 | 路径 |
| --- | --- |
| 单 PR 证据目录 | `D:\workspace\openclaw-windows-stability-lab\evidence\openclaw-pr-76024` |
| 证据索引 | `D:\workspace\openclaw-windows-stability-lab\evidence\openclaw-pr-76024\README.md` |
| PR 全页截图 | `D:\workspace\openclaw-windows-stability-lab\evidence\openclaw-pr-76024\pr-76024-conversation-fullpage-2026-05-02.png` |
| Phase 2 handoff | `D:\workspace\openclaw-windows-stability-lab\reports\OWSL_PHASE2_64187_HANDOFF_2026-05-02.md` |
| 调研记录 | `D:\workspace\openclaw-windows-stability-lab\upstream\spike-64187-sqlite-ebusy.md` |

### 状态更新 - 2026-05-02

- 事件：PR #76024 已被 `steipete` 合并并关闭。
- 时间：2026-05-02 18:07:49 +08:00。
- Merge commit：`f3fd0eedff215967eb75361d241dd5e6cea602e8`。
- 证据来源：GitHub Pulls API 与 Issue Events API。
- 影响：这条贡献从“提交上游并等待 maintainer review”升级为“已被上游合并”，后续对外内容可以明确表述为“OpenClaw 官方仓库已合并我们的 Windows memory-core 稳定性修复 PR”。

### 后续动作

- 截取合并后 PR 页面截图，补充 `merged` 状态证据。
- 关注 #64187 是否随 PR 自动关闭，以及 #71611 是否被 maintainer 关闭、改写或继续推进。
- 后续文章和视频中可以使用这条作为“实战派上游贡献被合并”的核心证据。

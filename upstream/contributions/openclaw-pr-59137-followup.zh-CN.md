# OpenClaw PR #59137 review follow-up 记录

更新时间：2026-05-12 11:15 +08:00

## 基本信息

| 字段 | 内容 |
| --- | --- |
| 上游仓库 | `openclaw/openclaw` |
| PR | https://github.com/openclaw/openclaw/pull/59137 |
| PR 标题 | `fix(memory): preserve retry state and embedding cache across reindex rollback` |
| PR 作者 | `TSHOGX` |
| PR 状态 | Open，`clawsweeper[bot]` 要求修改后再合并 |
| review 时间 | 2026-05-12 02:51:44 +08:00 |
| review 结论 | `needs changes before merge` |
| 我们的跟进分支 | https://github.com/kunpeng-ai-lab/openclaw/tree/codex/pr-59137-before-temp-cleanup |
| 我们的跟进 commit | `cb02215b5` |
| 本地 worktree | `C:\Users\kzy-1\.config\superpowers\worktrees\openclaw\codex-pr-59137-cleanup` |

## 上游 review 摘要

`clawsweeper[bot]` 认可 PR 的主方案：恢复 memory reindex rollback 的 sync state、增加 `sessionFullRetryPending`、在 safe reindex 中镜像 embedding cache、兼容旧 index，并补充测试和 changelog。

阻塞点只有一个 P2：

> PR 分支在 `runSafeReindex` 中调用 `runMemoryAtomicReindex` 时，没有保留 current main 的 `beforeTempCleanup` / `tempDbClosed` 清理顺序。provider failure 触发 rollback 时，atomic helper 可能在 temp SQLite handle 仍然打开的情况下删除 temp sqlite 文件，导致 Windows 文件锁、`AggregateError` 或 temp sidecar 泄漏。

## 本次跟进修复

本次在独立 worktree 中基于 PR #59137 head `b4315b7e` 做了一个最小 follow-up commit：

- `manager-atomic-reindex.ts`
  - 为 `runMemoryAtomicReindex` 恢复可选 `beforeTempCleanup` 回调。
  - 在删除 temp sqlite 文件前调用该回调。
- `manager-sync-ops.ts`
  - 在 `runSafeReindex` 中增加 `tempDbClosed` 状态和 `closeTempDb()`。
  - 成功路径、失败路径和 `beforeTempCleanup` 都通过同一个 idempotent cleanup 关闭 temp DB。
  - 保留 PR #59137 的 retry-state restore 和 embedding cache mirror 行为。
- `manager.atomic-reindex.test.ts`
  - 增加测试，证明 failed build 后会先调用 cleanup callback，再删除 temp index files。

## 本地验证

执行目录：

```text
C:\Users\kzy-1\.config\superpowers\worktrees\openclaw\codex-pr-59137-cleanup
```

验证结果：

| 命令 | 结果 |
| --- | --- |
| `pnpm test extensions/memory-core/src/memory/manager.reindex-recovery.test.ts extensions/memory-core/src/memory/manager.atomic-reindex.test.ts` | 2 test files passed, 10 tests passed |
| `pnpm test extensions/memory-core` | 56 test files passed, 632 tests passed |
| `pnpm check:changed` | exit code 0 |
| `git diff --check` | exit code 0 |

依赖环境备注：

- 隔离 worktree 首次安装依赖时，`@openclaw/fs-safe` GitHub dependency 没有生成 `dist/config.js`，导致测试无法导入。
- 为完成本地验证，临时从 `openclaw/fs-safe` 拉取 commit `c7ccb99d3058f2acf2ad2758ad2470c7e113a53c`，本地 `pnpm build` 后把 `dist` 复制到 worktree 的 `node_modules/@openclaw/fs-safe/dist`。
- 该操作只用于本地验证，不属于提交内容。

## 当前限制

PR #59137 的 head branch 属于 `TSHOGX`，我们没有直接 push 到原 PR 分支的权限。因此本次 follow-up 已推送到 `kunpeng-ai-lab/openclaw` 的独立分支，后续需要：

1. 在 PR #59137 下评论，说明补丁分支和验证结果；
2. 由原作者 cherry-pick `cb02215b5`，或 maintainer 手动采纳；
3. 如果 maintainer 更希望我们开独立 PR，再从该分支发起后续 PR。

## 建议粘贴到 PR #59137 的评论

```text
I took a pass at the clawsweeper P2 cleanup finding and prepared a narrow follow-up commit here:

https://github.com/kunpeng-ai-lab/openclaw/tree/codex/pr-59137-before-temp-cleanup

Commit: cb02215b5 fix(memory): close temp db before reindex cleanup

What it changes:
- Restores an optional beforeTempCleanup callback on runMemoryAtomicReindex.
- Wires runSafeReindex to close the temp SQLite handle through an idempotent closeTempDb() before the atomic helper removes temp sqlite files on failure.
- Keeps the PR's retry-state restoration and embedding-cache mirror behavior unchanged.
- Adds a focused atomic-reindex test proving the cleanup callback runs before temp index files are removed after a failed build.

Local verification:
- pnpm test extensions/memory-core/src/memory/manager.reindex-recovery.test.ts extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
  - 2 test files passed, 10 tests passed
- pnpm test extensions/memory-core
  - 56 test files passed, 632 tests passed
- pnpm check:changed
  - exit code 0
- git diff --check
  - exit code 0

I do not have push access to the PR head branch, so this is available for cherry-pick or for maintainer review if useful.
```


# OpenClaw PR #76024 上游贡献记录

记录时间：2026-05-02
最新更新：2026-05-02 19:10 +08:00

## 一句话结论

这是 OWSL Phase 2 的第一条主线贡献：针对 OpenClaw #64187 的 Windows SQLite atomic reindex `EBUSY` 问题，提交了一个小范围、可测试、可回退的 memory-core 文件交换重试补丁，并已被 OpenClaw 上游合并。

## 链接

| 类型 | 链接 |
| --- | --- |
| PR | https://github.com/openclaw/openclaw/pull/76024 |
| Issue | https://github.com/openclaw/openclaw/issues/64187 |
| 相关上游 PR | https://github.com/openclaw/openclaw/pull/71611 |

## PR 元数据

| 字段 | 内容 |
| --- | --- |
| 标题 | `fix(memory): retry transient index swaps on Windows` |
| 状态 | Merged / Closed |
| 作者 | `kunpeng-ai-lab` |
| Base | `openclaw:main` |
| Head | `kunpeng-ai-lab:codex/openclaw-64187-sqlite-ebusy` |
| Commit | `2b53246ab5cc75a0e46309c52cdc653afcc40d04` |
| Commit 短码 | `2b53246` |
| Merge commit | `f3fd0eedff215967eb75361d241dd5e6cea602e8` |
| Merged by | `steipete` |
| Merged at | 2026-05-02 18:07:49 +08:00 |
| PR 提交时间 | 2026-05-02 17:57:54 +08:00 |
| GitHub commit 页面日期 | 2026-05-02 |
| Files changed | 3 |
| Diff size | `+137 -11` |

## 改动范围

| 文件 | 用途 |
| --- | --- |
| `extensions/memory-core/src/memory/manager-atomic-reindex.ts` | 在 memory index 文件族 rename 过程中增加有限重试 |
| `extensions/memory-core/src/memory/manager.atomic-reindex.test.ts` | 增加 transient retry、retry exhaustion、sidecar `ENOENT`、non-transient error 测试 |
| `CHANGELOG.md` | 根据 bot review 补充 changelog entry |

## 验证记录

执行目录：

```text
C:\Users\kzy-1\.config\superpowers\worktrees\openclaw\codex-openclaw-64187-sqlite-ebusy
```

```powershell
pnpm exec vitest run extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

结果：

```text
1 test file passed
6 tests passed
```

```powershell
$env:Path = 'D:\nvm4w\nodejs;' + $env:Path
node --version
pnpm exec vitest run extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

结果：

```text
v22.22.2
1 test file passed
6 tests passed
```

```powershell
$env:Path = 'D:\nvm4w\nodejs;' + $env:Path
pnpm lint:extensions -- extensions/memory-core/src/memory/manager-atomic-reindex.ts extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

结果：

```text
0 warnings
0 errors
```

```powershell
$env:Path = 'D:\nvm4w\nodejs;' + $env:Path
pnpm check:changed
```

结果：

```text
exit code 0
```

```powershell
git diff --check
```

结果：

```text
exit code 0
```

## Bot review 摘要

`clawsweeper` bot 的 review 结论：

- 这个 PR 增加了 bounded retry，处理 memory-core SQLite index swap 中的瞬时 `EBUSY` / `EPERM` / `EACCES` rename failure。
- 已有 regression tests 和 changelog entry。
- #64187 提供了具体 Windows 复现步骤和 `EBUSY` rename logs。
- 当前 main 仍然是直接 `fs.rename` swap path，缺少 transient retry coverage。
- 需要 maintainer review before merge。
- Maintainer 需要在本 PR 的 retry-only 方案和 #71611 的 fallback 方案之间选择。

## CI / mergeability 证据

| 项目 | 状态 |
| --- | --- |
| Checks | GitHub checks 页面显示 79 个 checks |
| 公开可见成功项 | `auto-response` succeeded |
| 公开可见 warning | 2 条 deprecated input warning，来自 `actions/create-github-app-token@v3` 的 `app-id` |
| 截图保留状态 | 可见 CI jobs 为成功状态 |
| Mergeability 截图 | `No conflicts with base branch`，`Changes can be cleanly merged` |

## 截图证据

| 文件 | 证明内容 |
| --- | --- |
| `D:\workspace\openclaw-windows-stability-lab\evidence\openclaw-pr-76024\pr-76024-conversation-fullpage-2026-05-02.png` | PR 标题、PR 状态、source/base branch、linked issue、bot review、CI/check list、无冲突状态 |

## 可复用素材点

- 不是“发了 PR”这么简单，而是从 Windows 真实 EBUSY 问题出发，做了范围收敛、最小补丁、TDD、Node 22/24 验证、lint、changed check、bot review 处理和 rebase。
- 这条贡献适合放入“AI 实战派 / 上游贡献 / Windows Agent 稳定性”内容线。
- 公开表述可以升级：PR 已被 `steipete` 合并，可以说“OpenClaw 官方仓库已合并我们的 Windows memory-core 稳定性修复 PR”。

## 状态更新规则

后续如果 PR 有新状态，直接在这里追加：

```text
## 状态更新 - YYYY-MM-DD

- 事件：
- 链接：
- 截图：
- 影响：
- 下一步：
```

## 状态更新 - 2026-05-02

- 事件：PR #76024 已被合并并关闭。
- Merged by：`steipete`。
- Merged at：2026-05-02 18:07:49 +08:00。
- Merge commit：`f3fd0eedff215967eb75361d241dd5e6cea602e8`。
- 证据来源：GitHub Pulls API 返回 `merged: true`、`state: closed`、`merged_by: steipete`、`merge_commit_sha: f3fd0eedff215967eb75361d241dd5e6cea602e8`；Issue Events API 返回 `merged` 和 `closed` events。
- 对外表述边界：可以说“已被上游合并”；仍不要夸大为“完整解决所有 Windows SQLite 稳定性问题”，因为本 PR 范围只覆盖 memory atomic reindex file swap 的 transient rename failure。
- 下一步：补一张合并后 PR 页面截图，作为视频和文章中的视觉证据。

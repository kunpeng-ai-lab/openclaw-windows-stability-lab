# Case: Windows memory atomic reindex EBUSY

Case ID: `openclaw-win-2026-05-02-memory-ebusy-atomic-reindex`

Status: `upstream-merged`

Primary source:

- OpenClaw issue: https://github.com/openclaw/openclaw/issues/64187
- OpenClaw PR: https://github.com/openclaw/openclaw/pull/76024

## Summary

On Windows, OpenClaw memory atomic reindex can hit transient file-lock errors
while swapping SQLite index files with `fs.rename`. The upstream fix retries
only transient rename failures during the index swap boundary.

## Environment

Observed and verified environment from OWSL PR work:

- OS: Windows 10 10.0.19045
- Node verification: v22.22.2 and v24.14.x targeted path
- OpenClaw surface: `extensions/memory-core`
- Install surface: upstream source worktree

## Symptoms

- memory search or memory reindex fails on Windows
- transient `EBUSY`, `EPERM`, or `EACCES` appears during file rename
- optional SQLite sidecar files may not exist and should not be treated as a
  fatal condition

## Root Cause Class

- `filesystem`
- `sqlite-file-swap`
- `windows-file-locking`

Windows file locking can reject file-level renames briefly even when the broader
SQLite database layer is otherwise healthy.

## Fix Shape

Merged upstream PR #76024:

- adds bounded retry for transient rename errors
- preserves current `ENOENT` sidecar behavior
- does not change SQLite journal mode
- does not change global `busy_timeout`
- keeps the behavior limited to memory atomic reindex file swaps

## Harness Mapping

Current harness target:

- `smoke process-tree` can help rule out duplicate or stale OpenClaw processes,
  but it does not reproduce memory reindex directly.

Future harness target:

- `memory-reindex-file-swap` smoke target
- deterministic fixture that simulates transient rename errors

## Decision Rule

If a Windows memory reindex failure contains `EBUSY`, `EPERM`, or `EACCES`
during index-family rename:

1. classify as `windows-file-lock-transient`
2. verify OpenClaw version contains PR #76024 or equivalent patch
3. run process inventory to rule out stale process ownership
4. do not change SQLite journal mode unless there is separate evidence

## GA Mapping

Reusable GA capabilities:

- reliability evidence ingestion from upstream PRs
- version matrix recommendation
- file-lock retry classification
- report-safe evidence summarization

GA should surface this as a "runtime file-lock resilience" capability, not as a
general SQLite architecture fix.

## Evidence

Local evidence archive:

- `evidence/openclaw-pr-76024/README.md`
- `evidence/openclaw-pr-76024/pr-76024-conversation-fullpage-2026-05-02.png`

Local handoff:

- `reports/OWSL_PHASE2_64187_HANDOFF_2026-05-02.md`

## Upstream Status

- PR #76024 merged by `steipete` on 2026-05-02.
- Public PR page shows merged state.


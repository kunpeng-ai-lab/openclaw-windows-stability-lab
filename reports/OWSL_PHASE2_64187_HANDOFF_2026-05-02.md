# OWSL Phase 2 Handoff: #64187 Windows SQLite EBUSY

Date: 2026-05-02
Prepared by: Codex
Reviewer: Claude Code
Status: Upstream PR submitted

## Scope

This handoff covers the first OWSL "mainline 2" upstream candidate after P0:

- Issue focus: OpenClaw #64187, Windows SQLite EBUSY / file lock instability
- Patch scope: memory-core atomic reindex file swaps only
- Non-scope: npm publish, GA integration, macOS, broader SQLite architecture,
  production release

## Worktree

The patch was prepared in an isolated OpenClaw worktree to avoid touching the
dirty local OpenClaw workspace.

```text
C:\Users\kzy-1\.config\superpowers\worktrees\openclaw\codex-openclaw-64187-sqlite-ebusy
```

Branch:

```text
codex/openclaw-64187-sqlite-ebusy
```

Base:

```text
origin/main
```

## Changed Files

```text
CHANGELOG.md
extensions/memory-core/src/memory/manager-atomic-reindex.ts
extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

## Upstream PR

Submitted after Owner approval.

```text
PR: https://github.com/openclaw/openclaw/pull/76024
Title: fix(memory): retry transient index swaps on Windows
Branch: kunpeng-ai-lab:codex/openclaw-64187-sqlite-ebusy
Latest commit: 2b53246ab
Submitted at: 2026-05-02 17:57:54 +08:00
```

Post-submission maintenance:

- Added the required `CHANGELOG.md` entry after bot review.
- Rebasing onto latest `origin/main` produced a `CHANGELOG.md` conflict.
- Conflict was resolved by keeping upstream fixes and adding the #64187 memory
  fix entry under `Unreleased / Fixes`.
- Force-pushed the rebased branch with `--force-with-lease`.

## Evidence Archive

Evidence materials were archived for later OWSL reporting, community recap, and
GEO source-authority reuse.

```text
D:\workspace\openclaw-windows-stability-lab\evidence\openclaw-pr-76024
```

Current files:

- `README.md`: evidence index and verified facts
- `pr-76024-conversation-fullpage-2026-05-02.png`: full-page GitHub PR
  screenshot showing PR state, bot review, checks, and no-conflict status

## Implementation Summary

The patch adds a small retry wrapper around memory index file `rename` calls.

Behavior:

- retries transient rename errors: `EBUSY`, `EPERM`, `EACCES`
- preserves current `ENOENT` behavior for optional `-wal` and `-shm` sidecars
- does not retry non-transient errors
- keeps `runMemoryAtomicReindex()` signature unchanged
- exports `moveMemoryIndexFiles()` so tests can inject deterministic file ops

Default retry budget:

- `maxRenameAttempts`: 6 (initial attempt + 5 retries)
- `renameRetryDelayMs`: 25
- delay is linear: 25ms, 50ms, 75ms...
- maximum wait after retryable failures: about 375ms

## TDD Evidence

### RED

New tests were written before implementation. They failed because
`moveMemoryIndexFiles` was not exported/implemented as a retryable function:

```text
TypeError: moveMemoryIndexFiles is not a function
```

### GREEN

After implementation:

```powershell
pnpm exec vitest run extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

Result:

```text
1 test file passed
6 tests passed
```

## Verification

All commands below were run in:

```text
C:\Users\kzy-1\.config\superpowers\worktrees\openclaw\codex-openclaw-64187-sqlite-ebusy
```

### Targeted Tests, Node 24

```powershell
pnpm exec vitest run extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

Result:

```text
1 test file passed
6 tests passed
```

### Targeted Tests, Node 22

```powershell
$env:Path = 'D:\nvm4w\nodejs;' + $env:Path
node --version
pnpm exec vitest run extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

Result:

```text
v22.22.2
1 test file passed
6 tests passed
```

### Extension Lint

```powershell
$env:Path = 'D:\nvm4w\nodejs;' + $env:Path
pnpm lint:extensions -- extensions/memory-core/src/memory/manager-atomic-reindex.ts extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

Result:

```text
Found 0 warnings and 0 errors.
```

### Changed Check

```powershell
$env:Path = 'D:\nvm4w\nodejs;' + $env:Path
pnpm check:changed
```

Result:

```text
exit code 0
```

### Diff Check

```powershell
git diff --check
```

Result:

```text
exit code 0
```

## Review Questions For CC

1. Is the exported `moveMemoryIndexFiles()` test seam acceptable for upstream,
   or should we hide it behind another pattern?
2. Should retryable errors stay limited to `EBUSY`, `EPERM`, and `EACCES`?
3. Is the default retry budget small enough for maintainers to accept?
4. Do you want a changelog entry for this PR candidate, or should we wait for
   maintainer feedback?

## CC Review Follow-up

CC reviewed the patch and approved it for Owner review with two P2 notes.

P2-1 was addressed:

- Added a retry exhaustion test.
- The test mocks `rename` to always return `EBUSY`.
- It verifies `maxRenameAttempts` attempts and `maxRenameAttempts - 1` waits.
- Verification now reports 6 passing tests.

P2-2 should be handled in the PR body:

- Explain that `moveMemoryIndexFiles()` is exported only as a deterministic test
  seam for injected file operations.
- It is not intended as a public API commitment.
-
If maintainers dislike the exported helper, fallback option:

- use a module-level mock for `node:fs/promises` in tests.

## Recommended Next Step

Monitor the upstream PR for maintainer feedback and CI completion. If maintainers
request avoiding the exported test seam, use the documented fallback:

- replace the exported `moveMemoryIndexFiles()` seam with module-level
  `node:fs/promises` mocking in tests.

# Investigation Spike: #64187 SQLite EBUSY on Windows

Date: 2026-05-02
Owner: Codex
Status: Upstream PR submitted

## Decision

#64187 should be handled as a narrow Windows file-locking fix around memory index
atomic reindex swaps, not as a broad SQLite architecture change.

The current patch candidate retries transient `fs.rename` failures while swapping
the SQLite index file family:

- `index.sqlite`
- `index.sqlite-wal`
- `index.sqlite-shm`

This is intentionally smaller than changing SQLite journal mode, changing global
`busy_timeout`, or wrapping unrelated SQLite stores.

## Latest Code Location

OpenClaw worktree:

`C:\Users\kzy-1\.config\superpowers\worktrees\openclaw\codex-openclaw-64187-sqlite-ebusy`

Changed files:

- `extensions/memory-core/src/memory/manager-atomic-reindex.ts`
- `extensions/memory-core/src/memory/manager.atomic-reindex.test.ts`

Branch:

`codex/openclaw-64187-sqlite-ebusy`

Upstream PR:

`https://github.com/openclaw/openclaw/pull/76024`

Latest pushed commit:

`2b53246ab`

## Evidence

Latest upstream code already uses `PRAGMA busy_timeout = 5000` in other SQLite
paths, but the memory atomic reindex flow performs file-level `rename` operations.
On Windows, transient locks from the process itself, antivirus, indexers, or
other readers can surface as rename errors even when SQLite busy timeout is not
the active layer.

The patch therefore focuses on the file swap boundary:

1. Build temporary memory index.
2. Move current index family to a backup path.
3. Move temporary index family to the target path.
4. Remove backup files.

The risk area is steps 2 and 3, where Windows can briefly reject `rename`.

## Patch Shape

Added behavior:

- Retry transient rename errors: `EBUSY`, `EPERM`, `EACCES`.
- Preserve existing `ENOENT` behavior for optional sidecar files.
- Throw immediately for non-transient rename errors.
- Keep default retry budget small: initial attempt + 5 retries, linear 25ms
  delay, about 375ms maximum wait after retryable failures.
- Keep the public `runMemoryAtomicReindex()` call shape unchanged.

Test seam:

- `moveMemoryIndexFiles()` is exported from the module so tests can inject
  deterministic file operations instead of relying on flaky real Windows locks.

## Verification

Commands run in the isolated OpenClaw worktree.

### RED

Before implementation, new tests failed with:

`TypeError: moveMemoryIndexFiles is not a function`

This confirmed the tests were exercising missing production behavior.

### GREEN

```powershell
pnpm exec vitest run extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

Result:

- 1 test file passed
- 6 tests passed

### Windows Node 22 Recheck

```powershell
$env:Path = 'D:\nvm4w\nodejs;' + $env:Path
node --version
pnpm exec vitest run extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

Result:

- Node `v22.22.2`
- 1 test file passed
- 6 tests passed

### Lint

```powershell
$env:Path = 'D:\nvm4w\nodejs;' + $env:Path
pnpm lint:extensions -- extensions/memory-core/src/memory/manager-atomic-reindex.ts extensions/memory-core/src/memory/manager.atomic-reindex.test.ts
```

Result:

- 0 warnings
- 0 errors

### Changed Checks

```powershell
$env:Path = 'D:\nvm4w\nodejs;' + $env:Path
pnpm check:changed
```

Result:

- exit code 0

### Whitespace

```powershell
git diff --check
```

Result:

- exit code 0

## Environment Note

Running `pnpm install --frozen-lockfile` under Node `v24.14.0` completed with
exit code 0, but logs showed optional native package build friction on Windows:
`@discordjs/opus` could not build because Visual Studio C++ tooling was missing.

This did not block the memory-core test path, but it is useful OWSL evidence:
Windows stability work should keep tracking Node version, path-with-space, and
native optional dependency behavior separately from the #64187 patch.

`pnpm lint:extensions` also failed when Node came from:

`D:\Program Files\nodejs\node.exe`

The failure was caused by a path-with-space shell invocation problem. Re-running
with Node from:

`D:\nvm4w\nodejs\node.exe`

passed. This should be captured as a separate harness/environment check, not
mixed into the #64187 PR.

## PR Recommendation

Submitted a small upstream PR for #64187 after CC review and Owner approval.

PR title:

`fix(memory): retry transient index swaps on Windows`

Suggested PR body points:

- Fixes/addresses #64187.
- Memory atomic reindex swaps SQLite index files using `fs.rename`.
- Windows can transiently reject rename while files are briefly locked.
- Retry only transient rename errors and keep `ENOENT` sidecar behavior.
- Adds deterministic tests for retry, retry exhaustion, `ENOENT`, and
  non-transient errors.

## Open Questions For CC Review

1. Is exporting `moveMemoryIndexFiles()` acceptable as a module-level test seam,
   or should we use a different internal testing pattern?
2. Should the retry list include only `EBUSY`, `EPERM`, `EACCES`, or add another
   Windows-specific code based on maintainer preference?
3. Is 5 attempts with 25ms linear delay conservative enough for upstream?

## Review Follow-up

CC reviewed the patch and approved it for Owner review. One P2 test suggestion
was incorporated after review:

- Added retry exhaustion coverage.
- `rename` is mocked to always return `EBUSY`.
- The test verifies 3 attempts and 2 waits for a 3-attempt retry budget.

The second P2 suggestion is PR-body guidance: explain that
`moveMemoryIndexFiles()` is exported as a deterministic fileOps injection seam
for tests, not as a public API commitment.

## Submission Follow-up

Submitted PR:

`https://github.com/openclaw/openclaw/pull/76024`

After submission, the upstream bot requested a changelog entry. The patch was
updated to include `CHANGELOG.md`, then rebased onto latest `origin/main` to
resolve a changelog conflict. The final branch was force-pushed with
`--force-with-lease`.

Final local verification after rebase:

- targeted vitest: 1 file passed, 6 tests passed
- extension lint: 0 warnings, 0 errors
- `pnpm check:changed`: exit code 0
- `git diff --check`: exit code 0

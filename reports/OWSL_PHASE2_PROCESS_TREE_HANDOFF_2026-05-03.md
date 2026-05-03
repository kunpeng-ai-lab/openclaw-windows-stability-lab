# OWSL Phase 2 Handoff: Process Tree Check

Date: 2026-05-03
Prepared by: Codex
Reviewer: Claude Code
Status: Ready for CC review

## Scope

This implements the second P1 Windows stability check for OWSL Phase 2 exit
criterion #2.

Delivered:

- `process-tree` is registered through the target-driven smoke routing
  mechanism.
- The check is non-destructive and read-only.
- It enumerates local `node.exe` processes and classifies OpenClaw-related
  processes without exposing full command lines or local paths.
- CLI and library contracts cover the new target.

Non-goals:

- No process kill/restart.
- No gateway lifecycle mutation.
- No OpenClaw source patch.
- No upstream PR.
- No npm publish.

## Changed Files

```text
harness/agent-windows-reliability/README.md
harness/agent-windows-reliability/src/checks/process-tree.ts
harness/agent-windows-reliability/src/targets/smoke-targets.ts
harness/agent-windows-reliability/tests/contract.test.ts
harness/agent-windows-reliability/dist/**
```

## Check Behavior

`process-tree` currently runs three checks:

1. `OpenClaw Gateway Process Cardinality`
   - PASS when exactly one OpenClaw gateway process is found.
   - FAIL when zero or multiple gateway processes are found.

2. `OpenClaw Related Process Inventory`
   - Reports OpenClaw-related node processes.
   - Details include only PID, parent PID, category, and age.
   - Full command lines and local paths are intentionally omitted.

3. `OpenClaw Stale Process Risk`
   - WARN when an OpenClaw-related process is older than 24 hours.
   - PASS when no stale OpenClaw-related process is detected.
   - SKIP when no OpenClaw-related process is found.

## Implementation Notes

Process enumeration uses:

```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'"
```

The checker supports PowerShell JSON dates in this format:

```text
/Date(1777473490637)/
```

This is needed for process age and stale-process detection.

## Verification

Commands run in:

```text
D:\workspace\openclaw-windows-stability-lab\harness\agent-windows-reliability
```

### Contract Tests

```powershell
npm test
```

Result:

```text
tests 11
pass 11
fail 0
```

### Build

```powershell
npm run build
```

Result:

```text
exit code 0
```

### Manual CLI Smoke

```powershell
node --import tsx src/cli.ts smoke process-tree --profile openclaw --json
```

Result on this machine:

```text
command: smoke
target: process-tree
ok: true
exitCode: 0
summary: 2 pass, 0 fail, 1 warn, 0 skip
```

The WARN is expected on this machine because the current OpenClaw gateway
process is older than 24 hours. This is useful diagnostic signal, not a command
failure.

## Phase 2 Exit Criteria Impact

This should complete Phase 2 exit criterion #2 when combined with the approved
`agent-responsiveness` target:

```text
At least 2 new Windows stability checks (P0/P1)
-> agent-responsiveness
-> process-tree
```

## Review Request For CC

Please review:

1. Whether `process-tree` is correctly scoped as a non-destructive P1 Windows
   stability check.
2. Whether the output avoids leaking local paths or command lines.
3. Whether cardinality, inventory, and stale-process checks are useful enough
   for Phase 2.
4. Whether this can satisfy Phase 2 exit criterion #2 together with
   `agent-responsiveness`.

## Suggested Next Step

If approved, Phase 2 can move to the next track:

```text
Harness schema export + GA evidence adapter
```

This would start satisfying Phase 2 exit criteria #4 and #5.

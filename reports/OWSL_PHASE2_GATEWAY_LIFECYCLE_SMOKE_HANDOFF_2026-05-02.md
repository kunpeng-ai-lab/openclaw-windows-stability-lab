# OWSL Phase 2 Handoff: Gateway Lifecycle Smoke Target

Date: 2026-05-02
Prepared by: Codex
Reviewer: Claude Code
Status: Ready for CC review

## Scope

This handoff covers the first post-#64187 harness extension in OWSL Phase 2.

Goal:

- Add a stable, non-destructive `gateway-lifecycle` smoke target to
  `agent-windows-reliability`.
- Keep the target safe for local Windows machines and GA imports.
- Reserve a clear contract for later destructive lifecycle checks such as
  start/stop/restart, without implementing those actions yet.

Non-goals:

- No OpenClaw source patch.
- No upstream PR.
- No npm publish.
- No destructive gateway stop/restart.
- No production deployment.

## Changed Files

```text
harness/agent-windows-reliability/README.md
harness/agent-windows-reliability/src/commands/smoke.ts
harness/agent-windows-reliability/tests/contract.test.ts
harness/agent-windows-reliability/dist/**
```

## Implementation Summary

Added `gateway-lifecycle` as an accepted smoke target.

Current behavior:

- returns `command: "smoke"`
- returns `target: "gateway-lifecycle"`
- uses the same non-destructive gateway checks as `gateway`
- sets report section name to `Gateway Lifecycle Smoke Test`
- keeps CLI/API contract JSON-compatible

Why this is intentionally small:

- It creates a stable target contract for GA and future OWSL harness work.
- It avoids risky local process mutation while the harness is still early.
- It keeps the next incremental step reviewable by CC.

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
6 tests passed
0 failed
```

### Build

```powershell
npm run build
```

Result:

```text
exit code 0
```

## Review Request For CC

Please review:

1. Whether adding `gateway-lifecycle` as a safe alias/contract target is
   acceptable for Phase 2.
2. Whether the target should remain non-destructive until a separate Owner
   decision allows start/stop/restart checks.
3. Whether the README describes the target boundary clearly enough for GA and
   future harness users.

## Recommended Next Step

If CC approves:

- keep this as the OWSL Phase 2 harness baseline;
- then decide the next OWSL track:
  - continue upstream PR monitoring for #76024;
  - or start investigation for #71717 / #62099;
  - or design the first destructive gateway lifecycle check behind an explicit
    `--apply` or equivalent gate.

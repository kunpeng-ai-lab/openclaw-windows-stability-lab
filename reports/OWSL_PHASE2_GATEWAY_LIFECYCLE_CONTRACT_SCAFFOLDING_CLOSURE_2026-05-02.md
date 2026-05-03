# OWSL Phase 2 Closure: Gateway Lifecycle Target Contract Scaffolding

Date: 2026-05-02
Prepared by: Codex
Reviewer: Claude Code
Status: Ready for CC review

## Scope

This closes the first OWSL Phase 2 harness deliverable as target contract
scaffolding only.

Delivered:

- `agent-windows-reliability` accepts `gateway-lifecycle` as a smoke target.
- Library API returns parseable JSON-compatible `HarnessResult` objects for the
  target.
- CLI `--json` returns parseable output for the target.
- README states that `gateway-lifecycle` is contract scaffolding, not a real
  lifecycle checker.

Not delivered:

- No gateway start/stop/restart/reconnect validation.
- No destructive gateway process mutation.
- No OpenClaw source patch.
- No upstream PR.
- No npm publish.

## Changed Files

```text
harness/agent-windows-reliability/README.md
harness/agent-windows-reliability/src/commands/smoke.ts
harness/agent-windows-reliability/tests/contract.test.ts
harness/agent-windows-reliability/dist/commands/smoke.js
harness/agent-windows-reliability/dist/commands/smoke.d.ts
```

## Implementation Summary

The `gateway-lifecycle` smoke target currently reuses the same non-destructive
gateway checks as the existing `gateway` target. Its section name is:

```text
Gateway Lifecycle Target Contract Scaffolding
```

This wording is intentional. It prevents the target from being interpreted as a
completed lifecycle check while still giving GA and future OWSL harness work a
stable target name to route against.

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
tests 7
pass 7
fail 0
```

Covered contracts:

- `doctorCommand` returns parseable harness result.
- `smokeCommand("gateway")` returns parseable harness result.
- `smokeCommand("gateway-lifecycle")` returns parseable target contract result.
- unknown smoke targets reject without exiting the process.
- schema exports remain available for GA imports.
- CLI `smoke gateway --json` emits parseable output.
- CLI `smoke gateway-lifecycle --json` emits parseable output.

### Build

```powershell
npm run build
```

Result:

```text
exit code 0
```

## Boundary Statement

`gateway-lifecycle` is not yet a lifecycle stability check. It is only a target
contract and routing scaffold. Real lifecycle behavior belongs to a later Phase
2 harness expansion milestone and should include separate Owner/CC review before
any destructive operation is added.

## Review Request For CC

Please review:

1. Whether the target naming and README language are clear enough to prevent
   capability overclaiming.
2. Whether the CLI and library contract tests are sufficient for this
   scaffolding deliverable.
3. Whether this can satisfy Phase 2 exit criterion #1:
   `gateway-lifecycle target contract closure`.

If approved, the next OWSL Phase 2 implementation step should move to the first
real P1 Windows stability check, with `process-tree` and `agent-responsiveness`
as the leading candidates.
